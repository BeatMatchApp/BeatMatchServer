import express from "express";
import config from "./config/config";
import playlistRoutes from "./routes/playlistRoutes";
import { createNewUser } from "./controllers/userController";

const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/playlist", playlistRoutes);

app.post("/user", createNewUser);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
