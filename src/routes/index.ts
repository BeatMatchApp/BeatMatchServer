import express from "express";
import playlistRoutes from "./playlistRoutes";
import { loginHandler } from "../loginHandler";
import userRoutes from "./userRoutes";
import metaRoute from "./meta";
import authMiddleware from "../middlewares/authMiddleware";
import MusicalAIRoutes from "./aiRoutes";

const router = express.Router();

router.use("/playlist", authMiddleware, playlistRoutes);
router.use("/user", userRoutes);
router.use("/login", authMiddleware, loginHandler);
router.use("/meta", authMiddleware, metaRoute);
router.use("/musicalAIConsultant", MusicalAIRoutes);

export default router;
