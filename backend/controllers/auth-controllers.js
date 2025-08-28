import bcrypt from "bcrypt";
import User from "../db/schemas/user-schema.js";
import { handleGenerateToken } from "../lib/utils/auth-utils.js";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || fullName.trim() === "" || !email || email.trim() === "") {
    return res
      .status(422)
      .json({ message: "Please fill all required fields! -fullName,email-" });
  }
  if (password.length < 6) {
    return res
      .status(422)
      .json({ message: "Password must be atleast six chars!" });
  }
  const isTakenEmail = await User.findOne({ email });
  if (isTakenEmail) {
    return res
      .status(409)
      .json({ message: "This email is already registered!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const accessToken = await handleGenerateToken(
      { id: newUser._id, role: newUser.role },
      process.env.ACCESS_SECRET_KEY,
      process.env.REFRESH_SECRET_KEY,
      res
    );
    return res.status(201).json({
      message: "User created successfully!",
      userData: {
        userId: newUser._id,
        name: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
      token: accessToken,
    });
  } catch (error) {
    console.log("SIGNUP ROUTE ERROR: ", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }
    const validPassword = await bcrypt.compare(password, currentUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }
    const accessToken = await handleGenerateToken(
      { id: currentUser._id, role: currentUser.role },
      process.env.ACCESS_SECRET_KEY,
      process.env.REFRESH_SECRET_KEY,
      res
    );
    return res.status(200).json({
      message: "Loged in successfully",
      userData: {
        userId: currentUser._id,
        name: currentUser.fullName,
        email: currentUser.email,
        role: currentUser.role,
      },
      token: accessToken,
    });
  } catch (error) {
    console.log("LOGIN ROUTE ERROR: ", error);
    if (
      error.message === "Something went wrong while tryin to genetate tokens!"
    ) {
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const logout = async (req, res) => {
  console.log(req.cookies.refreshToken);
  try {
    res.clearCookie("refreshToken", {
      path: "/api/refresh/access-token",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(204).send();
  } catch (error) {
    console.log("LOGOUT ERROR: ", error);
    return res.status(500).json({ message: "Couldn't logout" });
  }
};

export const refreshToken = async (req, res) => {
  const { userId, userRole } = req.user;
  try {
    const accessToken = await handleGenerateToken(
      { id: userId, role: userRole },
      process.env.ACCESS_SECRET_KEY,
      process.env.REFRESH_SECRET_KEY,
      res
    );
    return res.status(200).json({
      message: "Refreshed successfully!",
      userId,
      role: userRole,
      token: accessToken,
    });
  } catch (error) {
    console.log("REFRESH ROUTE ERROR: ", error);
    if (
      error.message === "Something went wrong while tryin to genetate tokens!"
    ) {
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error!" });
  }
};
