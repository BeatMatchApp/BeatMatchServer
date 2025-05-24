import express from "express";
import * as userPreferencesController from "../controllers/userPreferencesController";

const router = express.Router();

router.post("/updatePreferences", userPreferencesController.upsertPreferences);

export default router;
