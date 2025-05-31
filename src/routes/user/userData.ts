import express from "express";
import * as userController from "../../controllers/userController";
import authMiddleware from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/details", authMiddleware, userController.getUserDetails);
router.post("/update", authMiddleware, userController.updateUserDetails);

export default router;
