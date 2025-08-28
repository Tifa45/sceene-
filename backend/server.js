import path from "path";
import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { connect } from "./db/db-connection.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routers/auth-routers.js";
import usersRoutes from "./routers/users-router.js";
import showsRourtes from "./routers/show-routes.js";
import commentsRoutes from "./routers/comment-routers.js";
import logsRoutes from "./routers/logs-routers.js";
import refreshRoutes from "./routers/refresh-routers.js";

configDotenv();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/refresh", refreshRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/shows", showsRourtes);
app.use("/api/comments", commentsRoutes);
app.use("/api/logs", logsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(5000, async () => {
  await connect();
  console.log("listening to port 5000");
});
