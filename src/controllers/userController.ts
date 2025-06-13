import { Request, Response } from "express";
import * as UserBl from "../bls/userBl";
import {USER_COOKIE} from "../consts/general";
import { UsersDAL } from "../dal/users";

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

export const logout = (_req: Request, res: Response) => {
  res.clearCookie(USER_COOKIE);
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

export const updateUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await UserBl.update(req, res, userId);

    if (!user) {
      res.status(500).json({ message: "Failed to update user." });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating user details." });
  }
};
