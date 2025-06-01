import { Response } from "express";
import { ACCESS_COOKIE, HOUR, MONTH, USER_COOKIE } from "../consts/general";
import { User } from "../models";

export const createAuthCookie = (res: Response, accessToken: string) => {
  res.cookie(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: HOUR,
  });
};

export const createUserCookie = (userId: User["id"], res: Response) => {
  res.cookie(USER_COOKIE, userId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: MONTH,
  });
};
