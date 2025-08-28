import express from "express";
import { checkingAuth, checkingRole } from "../middlewares/auth-middlewares.js";
import { getLogs } from "../controllers/auditLogs-controllers.js";

const router = express.Router();

router.get("/get-logs", checkingAuth, checkingRole(["admin"]), getLogs);

export default router;
