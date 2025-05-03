import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../consts/general";

export interface AuthRequest extends Request {
  user?: { id: string };
}

const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
  const token = req.cookies.access;
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user as { id: string };
    next();
  });
};

export default authMiddleware;