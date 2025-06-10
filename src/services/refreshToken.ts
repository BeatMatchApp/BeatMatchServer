import { Request, Response } from 'express';
import { refreshSpotifyAccessToken } from './spotifyService';
import { createAuthCookie } from './createAuthCookie';
import { ACCESS_COOKIE, HOUR, MONTH, REFRESH_COOKIE } from '../consts/general';

export const refreshAuthToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[REFRESH_COOKIE];

  try {
    const newAccessToken = await refreshSpotifyAccessToken(refreshToken);

    createAuthCookie(res, newAccessToken);

    req.cookies[ACCESS_COOKIE] = newAccessToken;
  } catch (error) {
    return res.status(401).json({ error: "Failed to refresh spotify's access token" });
  }
};

export const createTokenCookies = (
  res: Response,
  accessToken: string,
  refreshToken?: string
) => {
  res.cookie(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: HOUR,
  });

  if (refreshToken) {
    res.cookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: MONTH,
    });
  }
};
