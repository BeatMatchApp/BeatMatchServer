import { Request, Response, NextFunction } from "express";
import { refreshAuthToken } from "../services/refreshToken";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.spotify_access_token;
  const refreshToken = req.cookies.spotify_refresh_token;
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
