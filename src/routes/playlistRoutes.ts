import express from 'express';
import * as playlistController from '../controllers/playlistController';
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get('/suggestion', authMiddleware, playlistController.suggestPlaylist);

export default router;