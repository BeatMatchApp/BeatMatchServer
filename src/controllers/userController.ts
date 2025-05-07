import { Request, Response } from "express";
import * as UserBl from "../bls/userBl";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "../consts/general";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { UsersDAL } from "../dal/users";
import { createAuthCookie } from "../services/createAuthCookie";

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

export const refreshAuthToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh;
  if (!refreshToken) return res.sendStatus(403);

  jwt.verify(refreshToken, config.jwtRefreshSecret, async (err, decoded) => {
    if (err || typeof decoded !== "object" || !decoded.email || !decoded.id) {
      return res.sendStatus(403);
    }

    const { id, email } = decoded as jwt.JwtPayload;

    const user = await UsersDAL.getUserById(id);
    if (!user || user.email !== email) {
      return res.sendStatus(403);
    }

    createAuthCookie(req, res, id, email);

    return res.status(200).json({ message: "Token refreshed successfully!" });
  });
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie(REFRESH_COOKIE);
  res.clearCookie(ACCESS_COOKIE);
  return res.status(200).json({ message: "Logged out successfully" });
};
