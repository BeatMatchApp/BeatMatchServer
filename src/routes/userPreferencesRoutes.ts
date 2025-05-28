import express from "express";
import * as userPreferencesController from "../controllers/userPreferencesController";

const router = express.Router();

router.get("/getPreferences", userPreferencesController.getPreferences);
router.post("/updatePreferences", userPreferencesController.upsertPreferences);

export default router;
