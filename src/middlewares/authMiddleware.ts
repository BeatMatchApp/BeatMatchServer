import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { refreshAuthToken } from "../controllers/userController";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.access;
  const refreshToken = req.cookies.refresh;
  let accessTokenToVerify = accessToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Access token missing or expired" });
  }

  if (!accessToken) {
    accessTokenToVerify = await refreshAuthToken(req, res);
  }

  jwt.verify(accessTokenToVerify, config.jwtSecret, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
};

export default authMiddleware;
