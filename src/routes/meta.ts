import express from "express";
import { getEvents, getMoods } from "../controllers/meta";

const router = express.Router();

router.get("/events", getEvents);
router.get("/moods", getMoods);

export default router;
