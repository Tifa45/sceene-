import mongoose from "mongoose";
import {
  applyDeleteManyLogger,
  applyFindAndUpdateLogger,
  applyFindOneAndDeleteLogger,
  applyUpdateLogger,
} from "../../lib/utils/db-utils.js";

const showSchema = new mongoose.Schema(
  {
  uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true,
      ref:"User"
    },
    title: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => v.trim().length !== 0,
        message: "Title can not be empty!",
      },
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
    },
    year: {type: String },
    genre: [
      {
        type: String,
        lowercase: true,
        trim: true,
        validate: {
          validator: (v) => v.trim().length !== 0,
          message: "Tag can not be empty!",
        },
      },
    ],
    avgRate: {
      type: Number,
      default: 0,
    },
    totalRates: {
      type: Number,
      default: 0,
    },
    views: { Number },
  },
  { timestamps: true }
);

applyUpdateLogger(showSchema, ["category", "genre"]);

applyFindAndUpdateLogger(showSchema, [
  "title",
  "description",
  "image",
  "category",
  "genre",
]);

applyFindOneAndDeleteLogger(showSchema);
applyDeleteManyLogger(showSchema);

const Show = mongoose.model("Show", showSchema);

export default Show;
