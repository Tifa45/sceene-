import bcrypt from "bcrypt";

import User from "../db/schemas/user-schema.js";

export const getCurrenUser = async (req, res) => {
  const { userId } = req.user;

  try {
    const currentUser = await User.findById(userId).lean();
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      userData: {
        userId: currentUser._id,
        name: currentUser.fullName,
        email: currentUser.email,
        role: currentUser.role,
        favorites: currentUser.favorites,
      },
    });
  } catch (error) {
    console.log("GET USER ROUTE ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const userInfo = await User.findById(id, "-password").lean();
    if (!userInfo) return res.status(404).json({ message: "No user found!" });

    return res.status(200).json({ userData: userInfo });
  } catch (error) {
    console.log("GET USER PROFILE ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const toggleFavorite = async (req, res) => {
  const { userId } = req.user;
  const { showId } = req.body;

  try {
    const favorites = await User.findById(userId, "favorites").lean();
    const isFavorite = favorites.favorites.some(
      (fav) => fav.toString() === showId.toString()
    );
    const update = isFavorite
      ? { $pull: { favorites: showId } }
      : { $push: { favorites: showId } };
    await User.findByIdAndUpdate(userId, update, { runValidators: true });
    return res
      .status(200)
      .json({ message: "Added successfully!", isFavorite: !isFavorite });
  } catch (error) {
    console.log("ADD TO FAVORITE ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const findUser = async (req, res) => {
  const limit = 20;
  const page = parseInt(req.query.page) || 0;
  const skip = page * limit;
  const searchTerm = req.query.search;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const searchByEmail = emailRegex.test(searchTerm?.trim()||"")||null;
  const filter = searchByEmail
    ? { email: searchTerm.trim() }
    : searchTerm
    ? { fullName: { $regex: searchTerm.trim(), $options: "i" } }
    : {};

  try {
    const [foundUsers, total] = await Promise.all([
      User.find(filter, "fullName email").sort({ createdAt: -1 }).limit(limit).skip(skip).lean(),
      User.countDocuments(filter),
    ]);
    if (foundUsers.length === 0)
      return res.status(404).json({ message: "No users found!" });

    return res.status(200).json({
      usersData: foundUsers,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    });
  } catch (error) {
    console.log("FIND USER ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const updateUser = async (req, res) => {
  const { userId, userRole } = req.user;

  const allowedFields = ["fullName", "email", "password", "currentPassword"];
  const fieldsToUpdate = Object.keys(req.body).reduce(
    (acc, key) => ((acc[key] = req.body[key]), acc),
    {}
  );

  const onlyAdmins = Object.keys(req.body).some(
    (field) => !allowedFields.includes(field)
  );

  if (onlyAdmins && userRole !== "admin") {
    return res
      .status(401)
      .json({ message: "Only admins can update these data!" });
  }
  if (fieldsToUpdate.fullName) {
    if (fieldsToUpdate.fullName.trim() === "") {
      return res.status(422).json({ message: "Please provide valid name!" });
    }
    fieldsToUpdate.fullName = req.body.fullName;
  }

  if (fieldsToUpdate.email) {
    if (fieldsToUpdate.email.trim() === "") {
      return res.status(422).json({ message: "Please provide valid email!" });
    }
    fieldsToUpdate.email = req.body.email;
  }

  try {
    const userToUpdate = await User.findById(req.body.userToUpdateId ?? userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (fieldsToUpdate.password) {
      const validPassword = await bcrypt.compare(
        req.body.currentPassword,
        userToUpdate.password
      );
      if (!validPassword) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect!" });
      }
      if (fieldsToUpdate.password.trim().length < 6) {
        return res
          .status(422)
          .json({ message: "Password must be at least six chars" });
      }
      const newPassword = await bcrypt.hash(fieldsToUpdate.password, 10);
      fieldsToUpdate.password = newPassword;
    }

    Object.assign(userToUpdate, fieldsToUpdate);

    await userToUpdate.save({ updaterId: userId });
    res.status(201).json({
      message: "Updated successfully!",
      userData: {
        name: userToUpdate.fullName,
        email: userToUpdate.email,
        role: userToUpdate.role,
      },
    });
  } catch (error) {
    console.log("UPDATE USER ROUTE ERROR: ", JSON.stringify(error));
    if (error.message.includes("E11000 duplicate key error"))
      return res.status(422).json({
        message: "Email is already taken, please provide a valid email!",
      });

    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const resetPassword = async (req, res) => {
  const { targetedUser } = req.body;
  const { userId } = req.user;
  const defaultPassword = await bcrypt.hash("123456", 10);
  try {
    await User.findByIdAndUpdate(
      targetedUser,
      { password: defaultPassword },
      { context: { updaterId: userId }, new: true, runValidators: true }
    );
    return res.status(200).json({ message: "Password resets successfully!" });
  } catch (error) {
    console.log("RESET PASSWORD ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
export const deleteUser = async (req, res) => {
  const { userId, userRole } = req.user;

  if (req.body.targetedUser && userRole !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can delete other users!" });
  }

  try {
    if (Array.isArray(req.body.targetedUser)) {
      await User.deleteMany(
        { _id: { $in: req.body.targetedUser } },
        { ordered: false, context: { deleterId: userId } }
      );
      return res.status(200).json({ message: "Deleted successfully!" });
    } else {
      const user = await User.findOneAndDelete(
        {
          _id: req.body.targetedUser ?? userId,
        },
        { context: { deleterId: userId } }
      );
      if (!user) {
        return res.status(404).json({ message: "User is not found!" });
      }

      res.status(200).json({ message: "User deleted successfully!" });
    }
  } catch (error) {
    console.log("DELETE USER ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
