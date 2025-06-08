import express, { Express } from 'express';
import routes from './routes';
import spotifyProxyRoutes from './routes/spotifyRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const createServer = async (): Promise<Express> => {
  try {
    const app = express();

    app.use(cookieParser());
    app.use(
        cors({ origin: process.env.BEATMATCH_CLIENT_URL, credentials: true })
    );

    app.use('/spotify', spotifyProxyRoutes);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/', routes);

    app.use('/public', express.static('public'));

    return app;
  } catch (error) {
    throw new Error(`Error initializing app: ${error.message}`);
  }
};

export default createServer;
