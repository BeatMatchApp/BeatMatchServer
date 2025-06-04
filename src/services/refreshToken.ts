import { Request, Response } from "express";
import { refreshSpotifyAccessToken } from "./spotifyService";
import { createAuthCookie } from "./createAuthCookie";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "../consts/general";

export const refreshAuthToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[REFRESH_COOKIE];

  try {
    const newAccessToken = await refreshSpotifyAccessToken(refreshToken);

    createAuthCookie(res, newAccessToken);

    req.cookies[ACCESS_COOKIE] = newAccessToken;
  } catch (error) {
    res.status(401).json({ error: "Failed to refresh spotify's access token" });
  }
};
