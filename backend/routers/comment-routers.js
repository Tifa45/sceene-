import express from "express";
import {
  addComment,
  deleteComment,
  editComment,
  getCommentDetails,
  getCommentsOfShow,
  getCommentsOfUser,
  toggleLikeComment,
} from "../controllers/comment-controllers.js";
import { checkingAuth, checkingRole} from "../middlewares/auth-middlewares.js";

const router = express.Router();

router.get("/show-comments", getCommentsOfShow);

router.get("/userComments", checkingAuth, checkingRole(["admin"]), getCommentsOfUser);

router.get("/commentDetails", checkingAuth, checkingRole(["admin"]), getCommentDetails);

router.post("/add", checkingAuth, addComment);

router.patch("/likes", checkingAuth, toggleLikeComment);

router.patch("/edit", checkingAuth, editComment);

router.delete("/delete", checkingAuth,  deleteComment);

export default router;
