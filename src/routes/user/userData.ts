import express from "express";
import * as userController from "../../controllers/userController";

const router = express.Router();

router.get("/details", userController.getUserDetails);
router.post("/update", userController.updateUserDetails);

export default router;
