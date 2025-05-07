import { Request, Response } from "express";
import { ACCESS_COOKIE, HOUR, REFRESH_COOKIE } from "../consts/general";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config/config";

export const createAuthCookie = (
  req: Request,
  res: Response,
  userId: string,
  userEmail: string
) => {
  const payload = { id: userId, email: userEmail };
  const options: SignOptions = { expiresIn: HOUR };
  const accessToken = jwt.sign(payload, config.jwtSecret, options);
  const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, options);

  res.cookie(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: HOUR,
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: HOUR,
  });
};
