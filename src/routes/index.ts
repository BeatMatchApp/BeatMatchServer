import express from "express";
import { credentialsMiddleware } from "../middlewares/credentialsMiddleware";
import playlistRoutes from "./playlistRoutes";
import { loginHandler } from "../loginHandler";
import userRoutes from "./userRoutes";

const router = express.Router();

router.use("/api/playlist", credentialsMiddleware, playlistRoutes);
router.use("/api/user", userRoutes);
router.use("/api/login", credentialsMiddleware, loginHandler);

export default router;
