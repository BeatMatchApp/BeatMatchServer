import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access;
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
};

export default authMiddleware;
