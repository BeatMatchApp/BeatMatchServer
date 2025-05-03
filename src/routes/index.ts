import express from "express";
import { credentialsMiddleware } from "../middlewares/credentialsMiddleware";
import playlistRoutes from "./playlistRoutes";
import { loginHandler } from "../loginHandler";
import userRoutes from "./userRoutes";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.use("/api/playlist", credentialsMiddleware, authMiddleware, playlistRoutes);
router.use("/api/user", userRoutes);
router.use("/api/login", credentialsMiddleware, loginHandler);

export default router;
