import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { refreshAuthToken } from "../controllers/userController";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.spotify_access_token;
  const refreshToken = req.cookies.spotify_refresh_token;
  let accessTokenToVerify = accessToken;

  if (!accessToken) {
    if (refreshToken) {
      accessTokenToVerify = await refreshAuthToken(req, res);
    } else {
      debugger;
      return res
        .status(401)
        .json({ message: "Access token missing or expired" });
    }
  }

  jwt.verify(accessTokenToVerify, config.jwtSecret, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
};

export default authMiddleware;
