import express from 'express';
import { spotifyProxy } from '../proxy/spotifyProxy';

const router = express.Router();

router.use('/login', ...spotifyProxy.createLoginProxy());
router.use('/users', ...spotifyProxy.createUsersProxy());
router.use('/playlists', ...spotifyProxy.createPlaylistsProxy());

export default router;
