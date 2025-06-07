import { Request, Response, NextFunction } from "express";
import { refreshAuthToken } from "../services/refreshToken";
import { ACCESS_COOKIE, REFRESH_COOKIE, USER_COOKIE } from "../consts/general";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies[ACCESS_COOKIE];
  const refreshToken = req.cookies[REFRESH_COOKIE];
  const userId = req.cookies[USER_COOKIE];

  if (!accessToken) {
    if (refreshToken) {
      await refreshAuthToken(req, res);
    } else {
      return res
        .status(401)
        .json({ message: "Access token missing or expired" });
    }
  }

  req.user = { id: userId, accessToken: req.cookies[ACCESS_COOKIE], refreshToken: req.cookies[REFRESH_COOKIE]};
  next();
};

export default authMiddleware;
