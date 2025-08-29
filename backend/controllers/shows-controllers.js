import { ObjectId } from "mongodb";
import Rate from "../db/schemas/ratings-schema.js";
import Show from "../db/schemas/show-schema.js";
import User from "../db/schemas/user-schema.js";

import { configDotenv } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import TImg from "../db/schemas/tempImag-schema.js";

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECERET,
});

export const getAllShows = async (req, res) => {
  const limit = 20;
  const page = parseInt(req.query.page) || 0;
  const skip = limit * page;

  try {
    const allShows = await Show.find()
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "email fullName")
      .limit(limit)
      .skip(skip)
      .lean();
    const total = await Show.countDocuments();

    return res.status(200).json({
      showsData: allShows,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log("GET ALL SHOWS ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getFilteredShows = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 0;
  const skip = limit * page;
  const queryFilters = req.query;

  const filters = {};
  if (req.query.except) {
    const notEqualTo = ObjectId.createFromHexString(req.query.except);
    filters._id = { $ne: notEqualTo };
  }
  if (req.query.exceptImg) {
    if (req.query.exceptImg.includes(",")) {
      filters.image = { $nin: req.query.exceptImg.split(",") };
    } else {
      filters.image = { $nin: [req.query.exceptImg] };
    }
  }

  Object.keys(queryFilters).forEach((key) => {
    if (
      key !== "page" &&
      key !== "except" &&
      key !== "exceptImg" &&
      key !== "limit" &&
      queryFilters[key].includes(",")
    ) {
      filters[key] = { $in: queryFilters[key].split(",") };
    } else if (
      key !== "page" &&
      key !== "except" &&
      key !== "exceptImg" &&
      key !== "limit"
    ) {
      filters[key] = { $in: [queryFilters[key]] };
    }
  });
  try {
    const shows = await Show.find(filters)
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "email fullName")
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Show.countDocuments(filters);

    return res
      .status(200)
      .json({ showsData: shows, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.log("GET Filtered SHOWS ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getShowsByCategory = async (req, res) => {
  const category = req.params.category;
  const limit = 20;
  const page = parseInt(req.query.page) || 0;
  const skip = limit * page;

  try {
    const shows = await Show.find({ category })
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "email fullName")
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Show.countDocuments({ category });

    return res
      .status(200)
      .json({ showsData: shows, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.log("GET SHOWS BY CAT ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getShowsByName = async (req, res) => {
  const limit = 20;
  const page = parseInt(req.query.page) || 0;
  const skip = page * limit;
  const search = req.query.search;
  const category = req.query.category;

  if (!search || search.trim().length === 0)
    return res.status(400).json({ message: "Search term is required." });

  const filters = { title: { $regex: search, $options: "i" } };
  if (category) {
    filters.category = category;
  }

  try {
    const shows = await Show.find(filters)
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "email fullName")
      .limit(limit)
      .skip(skip)
      .lean();
    const total = await Show.countDocuments(filters);

    if (!shows) {
      return res
        .status(404)
        .json({ message: "No match for your search, try an other keyword!" });
    }
    return res.status(200).json({
      showsData: shows,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    });
  } catch (error) {
    console.log("GET SHOWS BY NAME ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getShowDetails = async (req, res) => {
  const showId = req.params.id;

  try {
    const show = await Show.findByIdAndUpdate(showId, {
      $inc: { views: 1 },
    }).populate("uploadedBy", "email fullName");
    if (!show) {
      return res.status(404).json({ message: "No data found!" });
    }
    return res.status(200).json({ showsData: show });
  } catch (error) {
    console.log("GET SHOWS BY ID ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getShowUserRate = async (req, res) => {
  const { userId } = req.user;
  const { id: ratedShowId } = req.params;
  try {
    const userRate = await Rate.find(
      { ratedShowId, raterId: userId },
      "rateValue"
    );

    if (!userRate || userRate.length === 0) {
      return res.status(404).json({ message: "No rates found!" });
    }
    return res.status(200).json({ currentRate: userRate[0].rateValue });
  } catch (error) {
    console.log("GET SHOW USER RATE ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
export const getFavorites = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId, "favorites").lean();
    const favoriteShows = await Show.find({
      _id: { $in: user.favorites },
    }).lean();
    return res.status(200).json({ showsData: favoriteShows });
  } catch (error) {
    console.log("GET FAVORITE ERROR: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addShow = async (req, res) => {
  const { userId } = req.user;
  const { showsToAdd } = req.body;
  const imgToAdd = showsToAdd
    .map((show) => show.image && show.image)
    .filter(Boolean);

  if (showsToAdd.length === 0) {
    return res.status(400).json({ message: "No data to be added!" });
  }

  const readyToAdd = showsToAdd.map((show) => ({
    uploadedBy: userId,
    ...show,
    ...(show.year ? { year: show.year.toString() } : {}),
  }));

  if (imgToAdd && imgToAdd.length > 0) {
    await TImg.deleteMany({ tempUrl: { $in: imgToAdd } });
  }

  try {
    const addedShows = await Show.insertMany(readyToAdd, {
      ordered: false,
      rawResult: true,
    });

    if (
      addedShows.insertedCount === 0 &&
      addedShows?.mongoose.validationErrors
    ) {
      return res.status(400).json({
        message: "Fail",
        results:
          addedShows.mongoose.validationErrors[0].errors.category.properties
            .message,
      });
    }
    if (
      addedShows.insertedCount !== 0 &&
      addedShows.mongoose.validationErrors.length > 0
    )
      return res.status(201).json({
        message: "Partial fail",
        results: `${addedShows.insertedCount} Added, ${addedShows.mongoose.validationErrors.length} Faild`,
      });
    if (
      addedShows.insertedCount !== 0 &&
      addedShows.mongoose.validationErrors.length === 0
    ) {
      return res.status(201).json({
        message: "Success",
        results: `${addedShows.insertedCount} Shows added`,
      });
    }
  } catch (error) {
    console.log("ADD SHOWS ERROR: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateManyShows = async (req, res) => {
  const { userId } = req.user;
  const allowedFields = ["category", "genre"];
  const { showsToUpdate, fieldsToupdate } = req.body;
  const cantDoBulk = Object.keys(fieldsToupdate).some(
    (key) => !allowedFields.includes(key)
  );
  if (cantDoBulk) {
    return res
      .status(400)
      .json({ message: "Cant not do bulk updates on those fields!" });
  }

  if (showsToUpdate.length === 0) {
    return res.status(400).json({ message: "No data to be updated!" });
  }
  const updates = {};
  for (const field in fieldsToupdate) {
    updates[field] = fieldsToupdate[field];
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No data to be updated!" });
  }

  try {
    const updatedShows = await Show.updateMany(
      {
        _id: { $in: showsToUpdate },
      },
      updates,
      { context: { updaterId: userId }, runValidators: true }
    );

    return res.status(200).json({
      message: `${updatedShows.modifiedCount} updated successfully!`,
    });
  } catch (error) {
    console.log("UPDATE MANY SHOWS ERROR: ", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateOneShow = async (req, res) => {
  const { userId } = req.user;
  const { showToUpdate, updates } = req.body;
  if (!showToUpdate || showToUpdate.trim().length === 0) {
    return res.status(404).json({ message: "No found doc to update!" });
  }
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No data to be updated!" });
  }
  if (updates.image) {
    await TImg.deleteOne({ tempUrl: updates.image });
  }
  try {
    await Show.findByIdAndUpdate(showToUpdate, updates, {
      runValidators: true,
      context: { updaterId: userId },
      new: true,
    });
    return res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    console.log("UPDATE ONE SHOW ERROR: ", error);
    return res.status(500).json({ messag: "Internal server error!" });
  }
};

export const deleteShows = async (req, res) => {
  console.log("delete");
  const { showToDelete } = req.body;
  const { userId } = req.user;
  try {
    await Show.deleteMany(
      { _id: { $in: showToDelete } },
      { context: { deleterId: userId } }
    );
    return res.status(200).json({ message: "deleted successfully!" });
  } catch (error) {
    console.log("DELET SHOWS ERROR: ", error);
    return res.status(500).json({ messag: "Internal server error!" });
  }
};

export const rateShow = async (req, res) => {
  const { ratedShowId, rateValue } = req.body;
  const { userId } = req.user;
  try {
    if (rateValue == 0) {
      await Rate.findOneAndDelete({ ratedShowId, raterId: userId });
    } else {
      await Rate.findOneAndUpdate(
        { ratedShowId, raterId: userId },
        { rateValue },
        {
          upsert: true,
          runValidators: true,
        }
      );
    }
    const ratedShowIdObj = ObjectId.createFromHexString(ratedShowId);
    const result = await Rate.aggregate([
      { $match: { ratedShowId: ratedShowIdObj } },

      {
        $group: {
          _id: null,
          avgRate: { $avg: "$rateValue" },
          total: { $sum: 1 },
        },
      },
    ]);
    await Show.findByIdAndUpdate(ratedShowId, {
      avgRate: result[0]?.avgRate || 0,
      totalRates: result[0]?.total || 0,
    });
    return res.status(200).json({ message: "Rated successfully!", rateValue });
  } catch (error) {
    console.log("RATE SHOW ERROR: ", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const handleImgeUpload = async (req, res) => {
  if (!req.file) return res.status(404).json({ message: "No file to upload!" });

  const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        { folder: "movies" },
        (error, result) => {
          if (result) {
            resolve(result);
          } else reject(error);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(cloudinaryStream);
    });
  };

  try {
    const result = await streamUpload(req.file.buffer);
    await TImg.insertOne({ tempUrl: result.secure_url });
    return res
      .status(201)
      .json({ message: "uploaded successfully", url: result.secure_url });
  } catch (error) {
    console.log("ERROR UPLOADIN IMG: ", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const handleImgeDelete = async (req, res) => {
  const { publicId } = req.body;
  try {
    const response = await cloudinary.uploader.destroy(publicId);

    if (
      response.result === "not found" ||
      response.result === "ok" ||
      response.result === "deleted"
    )
      return res.status(204).end();
  } catch (error) {
    console.log("ERROR DELETE IMG: ", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const handleCleanImgs = async (req, res) => {
  const imgsToClean = await TImg.find();
  if (!imgsToClean || imgsToClean.length === 0) {
    return res.status(404).end();
  }
  const urlToClean = [];
  imgsToClean.forEach((imgDoc) => {
    const imgUrl = imgDoc.tempUrl;
    const splited = imgUrl.split("/");
    const publicId = splited[splited.length - 1].split(".")[0];
    const folderName = splited[splited.length - 2];
    const path = folderName + "/" + publicId;
    urlToClean.push(path);
  });

  try {
    await cloudinary.api.delete_resources(urlToClean);
    await TImg.deleteMany({});
    return res.status(204).end();
  } catch (error) {
    console.log("ERROR CLEAN IMG: ", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};
