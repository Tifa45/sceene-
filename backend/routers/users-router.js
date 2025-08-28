import express from "express";
const router = express.Router();

import {
  deleteUser,
  findUser,
  getCurrenUser,
  getUserProfile,
  resetPassword,
  toggleFavorite,
  updateUser,
} from "../controllers/users-controlles.js";
import { checkingAuth, checkingRole } from "../middlewares/auth-middlewares.js";

router.get("/current-user", checkingAuth, getCurrenUser);
router.get("/find-user", checkingAuth, checkingRole(["admin"]), findUser);
router.get("/profile/:id", getUserProfile);
router.patch("/update", checkingAuth, updateUser);
router.patch(
  "/reset-password",
  checkingAuth,
  checkingRole(["admin"]),
  resetPassword
);
router.delete("/delete", checkingAuth, deleteUser);

router.patch("/favorite", checkingAuth, toggleFavorite);
export default router;
