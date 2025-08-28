import mongoose from "mongoose";
import {
  
  applyDeleteManyLogger,
  applyFindOneAndDeleteLogger,
  
} from "../../lib/utils/db-utils.js";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true,
      ref:"User"
    },
    relatedShow: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true,
      ref:"Show"
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      immutable: true,
      default: null,
    },
    content: {
      type: String,
      required: true,
      validate: {
        validator: (v) => v.trim().length !== 0,
        message: "Comment can not be empty!",
      },
    },
    likes: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

applyFindOneAndDeleteLogger(commentSchema);
applyDeleteManyLogger(commentSchema)


const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
