import mongoose from "mongoose";

const tempImage = new mongoose.Schema(
  {
    tempUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const TImg = mongoose.model("TImg", tempImage);

export default TImg;
