import express from "express";
import {
  addShow,
  deleteShows,
  getAllShows,
  getFavorites,
  getFilteredShows,
  getShowDetails,
  getShowsByCategory,
  getShowsByName,
  getShowUserRate,
  handleCleanImgs,
  handleImgeDelete,
  handleImgeUpload,
  rateShow,
  updateManyShows,
  updateOneShow,
} from "../controllers/shows-controllers.js";
import { checkingAuth, checkingRole } from "../middlewares/auth-middlewares.js";
import { uploadStore } from "../middlewares/upload-middleware.js";

const router = express.Router();

router.get("/", getAllShows);
router.get("/filtered", getFilteredShows);
router.get("/category/:category", getShowsByCategory);
router.get("/search", getShowsByName);
router.get("/favorites", checkingAuth, getFavorites);
router.get("/one-show/:id", getShowDetails);
router.get("/user-rate/:id", checkingAuth, getShowUserRate);

router.post(
  "/add",
  checkingAuth,
  checkingRole(["moderator", "admin"]),
  addShow
);
router.patch(
  "/update",
  checkingAuth,
  checkingRole(["moderator", "admin"]),
  updateOneShow
);
router.patch(
  "/update-many",
  checkingAuth,
  checkingRole(["moderator", "admin"]),
  updateManyShows
);
router.delete(
  "/delete",
  checkingAuth,
  checkingRole(["moderator", "admin"]),
  deleteShows
);

router.patch("/rate", checkingAuth, rateShow);

router.post(
  "/upload-img",
  checkingAuth,
  checkingRole(["moderator", "admin"]),
  uploadStore,
  handleImgeUpload
);
router.post(
  "/delete-img",
  checkingAuth,
  checkingRole(["moderator", "admin"]),
  handleImgeDelete
);

router.post("/clean-img", handleCleanImgs);
export default router;
