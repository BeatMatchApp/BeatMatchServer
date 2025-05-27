import express from "express";
import * as userController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/details", authMiddleware, userController.getUserDetails);

export default router;
