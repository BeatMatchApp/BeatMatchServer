import express from "express";
import * as aiController from "../controllers/aiController";

const router = express.Router();

router.post("/createPlaylist", aiController.createPlaylist);
router.post("/refreshPlaylist", aiController.refreshPlaylist);
router.post("/suggestSong", aiController.suggestSongByPlaylist);

export default router;
