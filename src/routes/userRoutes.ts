import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
// router.post("/refresh", userController.refreshAuthToken);
router.post("/logout", userController.logout);

export default router;
