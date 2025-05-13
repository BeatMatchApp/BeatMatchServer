import express from "express";
import { credentialsMiddleware } from "../middlewares/credentialsMiddleware";
import playlistRoutes from "./playlistRoutes";
import { loginHandler } from "../loginHandler";
import userRoutes from "./userRoutes";
import authMiddleware from "../middlewares/authMiddleware";
import spotifyRoutes from "./spotifyRoutes";

const router = express.Router();

router.use("/playlist", credentialsMiddleware, authMiddleware, playlistRoutes);
router.use("/user", userRoutes);
router.use("/login", credentialsMiddleware, loginHandler);
router.use("/spotify", spotifyRoutes)

export default router;
