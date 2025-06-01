import { Request, Response } from "express";
import { refreshSpotifyAccessToken } from "./spotifyService";
import { createAuthCookie } from "./createAuthCookie";

export const refreshAuthToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.spotify_refresh_token;

  try {
    const newAccessToken = await refreshSpotifyAccessToken(refreshToken);

    createAuthCookie(res, newAccessToken);

    req.cookies.spotify_access_token = newAccessToken;
  } catch (error) {
    res.status(401).json({ error: "Failed to refresh spotify's access token" });
  }
};
