import express from "express";

import { refreshToken } from "../controllers/auth-controllers.js";
import { checkingRefreshToken } from "../middlewares/auth-middlewares.js";

export const router = express.Router();

router.post("/access-token", checkingRefreshToken, refreshToken);
export default router;
