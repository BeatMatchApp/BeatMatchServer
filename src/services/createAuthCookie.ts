import { Response } from "express";
import { HOUR, MONTH } from "../consts/general";
import { User } from "../models";

export const createAuthCookie = (res: Response, accessToken: string) => {
  res.cookie("spotify_access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: HOUR,
  });
};

export const createUserCookie = (userId: User["id"], res: Response) => {
  res.cookie("user_id", userId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: MONTH,
  });
};
