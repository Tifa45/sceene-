import express from "express";
import {
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/auth-controllers.js";
import { checkingRefreshToken } from "../middlewares/auth-middlewares.js";

export const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
