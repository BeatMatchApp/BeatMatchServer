import express from 'express';
import * as playlistController from '../controllers/playlistController';

const router = express.Router();

router.get('/suggestion', playlistController.suggestPlaylist);

export default router;  