import express from 'express';
import { spotifyProxy } from '../proxy/spotifyProxy';

const router = express.Router();

router.use(
  '/login',
  (_, _1, next) => {
    console.log('Spotify login route hit');
    next();
  },
  ...spotifyProxy.createLoginProxy()
);
router.use('/users', ...spotifyProxy.createUsersProxy());
router.use('/playlists', ...spotifyProxy.createPlaylistsProxy());
router.use('/general', ...spotifyProxy.createGeneralProxy());

export default router;
