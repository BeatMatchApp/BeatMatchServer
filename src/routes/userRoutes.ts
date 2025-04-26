import express from "express";
import * as userController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", authMiddleware, userController.register);
router.post("/login", authMiddleware, userController.login);

export default router;
