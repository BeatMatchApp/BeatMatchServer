import express from 'express';
import { spotifyProxy } from '../proxy/spotifyProxy';
import axios from 'axios';
import config from '../config/config';

const router = express.Router();

const getLogin = () => {
  axios.post(config.spotifyServiceUrl + '/spotifyAPI/login');
};
router.use(
  '/login',
  //   (_, _1, next) => {
  //     console.log('Spotify login route hit');
  //     next();
  //   },
  getLogin
);
router.use('/users', ...spotifyProxy.createUsersProxy());
router.use('/playlists', ...spotifyProxy.createPlaylistsProxy());
router.use('/general', ...spotifyProxy.createGeneralProxy());

export default router;
