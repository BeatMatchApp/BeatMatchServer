import { Request, Response } from "express";
import * as UserBl from "../bls/userBl";
import { JWT_REFRESH_SECRET } from "../consts/general";
import jwt from 'jsonwebtoken';
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
  if (!refreshToken) return res.sendStatus(401);
  
  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decoded: jwt.JwtPayload | string | undefined) => {
    if (err) return res.sendStatus(401);
    const { email, password} = decoded as jwt.JwtPayload;
    login(email, password);
  });  
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("refresh");
  res.clearCookie("access");
  return res.status(200).json({ message: 'Logged out successfully' });
};