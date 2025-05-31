import express from "express";
import * as userController from "../../controllers/userController";
import authMiddleware from "../../middlewares/authMiddleware";

const router = express.Router();

router.use("/", authMiddleware, userController.getUserDetails);
router.post("/", authMiddleware, userController.updateUserDetails);

export default router;
