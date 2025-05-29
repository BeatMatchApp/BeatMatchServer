import dotenv from "dotenv";

dotenv.config();

export default {
  port: parseInt(process.env.PORT || "22"),
  prodPort: parseInt(process.env.HTTPS_PORT || "21771"),
  nodeEnv: process.env.NODE_ENV || "development",
  geminiApiKey: process.env.GEMINI_API_KEY,
  openAiApiKey: process.env.OPENAI_API_KEY,
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
};
