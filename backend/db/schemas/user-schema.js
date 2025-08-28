import mongoose from "mongoose";
import {
  applyDeleteManyLogger,
  applyFindAndUpdateLogger,
  applyFindOneAndDeleteLogger,
  applySaveLogger,
} from "../../lib/utils/db-utils.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => v.trim().length !== 0,
        message: "Name can not be empty!",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email!"],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "public",
      trim: true,
      lowercase: true,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

applySaveLogger(userSchema, ["fullName", "email", "password", "role"]);
applyFindAndUpdateLogger(userSchema, ["password"]);
applyFindOneAndDeleteLogger(userSchema);
applyDeleteManyLogger(userSchema);

const User = mongoose.model("User", userSchema);

export default User;
