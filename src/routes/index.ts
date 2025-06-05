import express from 'express';
import playlistRoutes from './playlistRoutes';
import { loginHandler } from '../loginHandler';
import userRoutes from './user/userData';
import authRoutes from './user/auth';
import metaRoute from './meta';
import authMiddleware from '../middlewares/authMiddleware';
import spotifyRoutes from './spotifyRoutes';
import userPreferencesRoutes from './userPreferencesRoutes';

const router = express.Router();

router.use('/login', authMiddleware, loginHandler);
router.use('/user', authMiddleware, userRoutes);
router.use('/auth', authRoutes);
router.use('/playlist', authMiddleware, playlistRoutes);
router.use('/userPreferences', authMiddleware, userPreferencesRoutes);
router.use('/meta', authMiddleware, metaRoute);
router.use('/spotify', spotifyRoutes);

export default router;
