import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  geminiApiKey: process.env.GEMINI_API_KEY,
  openAiApiKey: process.env.OPENAI_API_KEY,
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  spotifyServiceUrl: process.env.SPOTIFY_SERVICE_URL!
};
