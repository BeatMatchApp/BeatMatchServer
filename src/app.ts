import express from "express";
import config from "./config/config";
import playlistRoutes from "./routes/playlistRoutes";
import userRoutes from "./routes/userRoutes";

const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/playlist", playlistRoutes);
app.use("/user", userRoutes);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
