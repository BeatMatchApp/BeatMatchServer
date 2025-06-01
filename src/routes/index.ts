import express from "express";
import playlistRoutes from "./playlistRoutes";
import { loginHandler } from "../loginHandler";
import userRoutes from "./user/userRoutes";
import metaRoute from "./meta";
import authMiddleware from "../middlewares/authMiddleware";
import userPreferencesRoutes from "./userPreferencesRoutes";

const router = express.Router();

router.use("/login", authMiddleware, loginHandler);
router.use("/user", userRoutes);
router.use("/playlist", authMiddleware, playlistRoutes);
router.use("/userPreferences", authMiddleware, userPreferencesRoutes);
router.use("/meta", authMiddleware, metaRoute);

export default router;
