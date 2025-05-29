import express, { Express } from "express";
import config from "./config/config";
import routes from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const createServer = async (): Promise<Express> => {
  try {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(
      cors({ origin: process.env.BEATMATCH_CLIENT_URL, credentials: true })
    );

    app.use("/", routes);

    return app;
  } catch (error) {
    throw new Error(`Error initializing app: ${error.message}`);
  }
};

export default createServer;
