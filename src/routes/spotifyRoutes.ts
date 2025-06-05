import express from 'express';
import { spotifyProxy } from '../proxy/spotifyProxy';
import axios from 'axios';
import config from '../config/config';
import https from 'https';

const router = express.Router();

const getLogin = async (_req, res) => {
  try {
    const response = await axios.get(
      `${config.spotifyServiceUrl}/spotifyAPI/login`,
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }), // only if using self-signed certs
        maxRedirects: 0, // don't follow redirects so you can inspect
        validateStatus: () => true,
      }
    );

    console.log('Got response from Spotify login proxy:', response.status);
    res.status(response.status).send(response.data); // or res.redirect(response.headers.location)
  } catch (err) {
    console.error('Error hitting Spotify login:', err.message);
    res.status(500).send('Error connecting to Spotify login');
  }
};

router.get('/login', getLogin);

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
