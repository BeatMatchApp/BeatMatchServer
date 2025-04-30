import express from "express";
import config from "./config/config";
import routes from "./routes";
import cookieParser from "cookie-parser";

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: process.env.BEATMATCH_CLIENT_URL, credentials: true }));

app.use("/", routes);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
