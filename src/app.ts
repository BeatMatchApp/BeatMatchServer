import express from "express";
import config from "./config/config";
import playlistRoutes from "./routes/playlistRoutes";
import userRoutes from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import { loginHandler } from "./loginHandler";
import { credentialsMiddleware } from "./middlewares/credentialsMiddleware";

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: process.env.BEATMATCH_CLIENT_URL, credentials: true }));

app.use("/api/playlist", credentialsMiddleware, playlistRoutes);
app.use("/user", credentialsMiddleware, userRoutes);
app.use("/login", credentialsMiddleware, loginHandler);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
