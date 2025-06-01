import { Request, Response, NextFunction } from "express";
import { refreshAuthToken } from "../services/refreshToken";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "../consts/general";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies[ACCESS_COOKIE];
  const refreshToken = req.cookies[REFRESH_COOKIE];
  const userId = req.cookies.user_id;

  if (!accessToken) {
    if (refreshToken) {
      await refreshAuthToken(req, res);
    } else {
      return res
        .status(401)
        .json({ message: "Access token missing or expired" });
    }
  }

  req.user = { id: userId };
  next();
};

export default authMiddleware;
