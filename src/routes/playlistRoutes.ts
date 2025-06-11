import express from 'express';
import * as playlistController from '../controllers/playlistController';

const router = express.Router();

router.post('/', playlistController.createPlaylist);
router.get('/', playlistController.getUserPlaylists);
router.get('/:playlistId', playlistController.getPlaylist);
router.post('/:playlistId/songs', playlistController.addSongsToPlaylist);
router.get('/:playlistId/songs', playlistController.getPlaylistSongs);
router.put('/:playlistId', playlistController.updatePlaylist);

export default router;