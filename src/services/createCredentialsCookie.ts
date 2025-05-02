import { Request, Response } from "express";
import { HOUR } from "../consts/general";

export const createCredentialsCookie = (
  req: Request,
  res: Response,
  userId: string
) => {
  res.cookie(
    "user_credentials",
    JSON.stringify({
      id: userId,
      spotify_access_token: req.cookies.spotify_access_token,
      spotify_refresh_token: req.cookies.spotify_refresh_token,
    }),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: HOUR,
    }
  );
};
