import express from "express";
import config from "./config/config";
import playlistRoutes from "./routes/playlistRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import cookieParser from 'cookie-parser';
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // your Vite dev server
  credentials: true               // allow cookies to be sent
}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('connected!');
});

app.use("/api/auth", authRoutes);
app.use("/api/playlist", playlistRoutes);
app.use("/api/user", userRoutes);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
