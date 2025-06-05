import express from 'express';
import { spotifyProxy } from '../proxy/spotifyProxy';

const router = express.Router();

router.use(
  '/login',
  () => {
    console.log('Spotify login route hit');
  },
  ...spotifyProxy.createLoginProxy()
);
router.use('/users', ...spotifyProxy.createUsersProxy());
router.use('/playlists', ...spotifyProxy.createPlaylistsProxy());
router.use('/general', ...spotifyProxy.createGeneralProxy());

export default router;
