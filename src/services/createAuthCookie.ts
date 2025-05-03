import { Request, Response } from "express";
import { HOUR, JWT_REFRESH_SECRET, JWT_SECRET } from "../consts/general";
import jwt, { SignOptions } from 'jsonwebtoken';

export const createAuthCookie = (
  req: Request,
  res: Response,
  userId: string,
  userEmail: string
) => {
  const payload = { id: userId, email: userEmail };
  const options: SignOptions = { expiresIn: HOUR };
  const accessToken = jwt.sign(payload, JWT_SECRET, options);
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, options);

  res.cookie("access", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: HOUR,
  });
  res.cookie("refresh", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: HOUR,
  });
};