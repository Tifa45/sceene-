import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  raterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    immutable: true,
  },
  ratedShowId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    immutable: true,
  },
  rateValue: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});
ratingSchema.index({ raterId: 1, ratedShowId: 1 }, { unique: true });

const Rate = mongoose.model("Rate", ratingSchema);
export default Rate;
