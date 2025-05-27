import { Request, Response } from "express";
import * as UserBl from "../bls/userBl";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "../consts/general";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";
import { UsersDAL } from "../dal/users";
import { createAuthCookie } from "../services/createAuthCookie";
import { User } from "../models";

export interface UserDetails {
  name: string;
  email: string;
  password: string;
  birthDate: string; // ISO date string
}

export class UserController {
  constructor() {}
}
export const register = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.userDetails) {
      res.status(400).json({ message: "Missing user details." });
      return;
    }

    const { email, password, name, birthDate }: UserDetails =
      req.body.userDetails;

    if (!email || !password || !name || !birthDate) {
      res
        .status(400)
        .json({ message: "Missing Fields.", name, email, password, birthDate });
      return;
    }

    return UserBl.register(req, res);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "An error occurred while registering." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.userDetails) {
      res.status(400).json({ message: "Missing user details." });
      return;
    }

    const { email, password }: UserDetails = req.body.userDetails;

    if (!email || !password) {
      res.status(400).json({ message: "Missing Fields.", email, password });
      return;
    }

    return UserBl.login(req, res);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "An error occurred while logging in." });
  }
};

const isJwtValueInvalid = (jwtValue: JwtPayload | undefined) => {
  return !jwtValue || !jwtValue.id || !jwtValue.email;
};

const isUserVerified = (user: User | undefined, email: string) => {
  return !user || user.email !== email;
};

export const refreshAuthToken = async (
  req: Request,
  res: Response
): Promise<string | undefined> => {
  const refreshToken = req.cookies.refresh;

  try {
    const decodedJwt = jwt.verify(
      refreshToken,
      config.jwtRefreshSecret
    ) as JwtPayload;

    if (isJwtValueInvalid(decodedJwt)) {
      res.status(401).json({ message: "Invalid refresh token." });
      return;
    }

    const { id, email } = decodedJwt;

    const user = await UsersDAL.getUserById(id);

    if (isUserVerified(user, email)) {
      res.status(401).json({ message: "User verification failed." });
      return;
    }

    const accessToken = createAuthCookie(req, res, id, email);

    return accessToken;
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token." });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie(REFRESH_COOKIE);
  res.clearCookie(ACCESS_COOKIE);
  return res.status(200).json({ message: "Logged out successfully" });
};

export const getUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user.id;
    const user = await UsersDAL.getUserById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user details." });
  }
};
