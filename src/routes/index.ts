import express from "express";
import playlistRoutes from "./playlistRoutes";
import { loginHandler } from "../loginHandler";
import userRoutes from "./userRoutes";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.use(
  "/playlist",
  //   spotifyServiceMiddleware,
  authMiddleware,
  playlistRoutes
);
router.use("/user", userRoutes);
router.use(
  "/login",
  // spotifyServiceMiddleware,
  loginHandler
);

export default router;
