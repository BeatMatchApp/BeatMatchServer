import express from "express";
import * as userController from "../../controllers/userController";
import authMiddleware from "../../middlewares/authMiddleware";
import userDataRoutes from "./userData";
import authRoutes from "./auth";

const router = express.Router();

router.use("/", authMiddleware, userDataRoutes);
router.use("/", authRoutes);

export default router;
