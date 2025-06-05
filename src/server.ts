import createServer from "./app";
import http, { Server } from "http";
import fs from "fs";
import https from "https";
import config from "./config/config";
import dotenv from "dotenv";

dotenv.config();

createServer().then((app) => {
  let port: number;

  app.use("*", (_, res) => {
    res.sendFile("client/index.html", { root: "public" });
  });

  let server: Server;
  server = http.createServer(app);

  if (config.nodeEnv !== "production") {
    console.log("development");
    port = config.port;
    server = http.createServer(app);
  } else {
    console.log("production");
    port = config.prodPort;

    const certs = {
      key: fs.readFileSync("./client-key.pem"),
      cert: fs.readFileSync("./client-cert.pem"),
    };

    server = https.createServer(certs, app);
  }

  server = server
    .listen(port, () => {
      if (config.nodeEnv !== "production")
        console.log(`Server running on http://localhost:${port}`);
      else console.log(`Server running on https://localhost:${port}`);
    })
    .on("error", (err) => {
      console.error("Error creating HTTPS server:", err.message);
    });
});
