import { Request, Response } from "express";
import { isValidDateString } from "../common/isValidDateString";
import { generateUserUUID } from "../common/userUUID";
import { UsersDAL } from "../dal/users";
import { UserDetails } from "../controllers/userController";
import { createAuthCookie } from "../services/createAuthCookie";

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, birthDate }: UserDetails = req.body.userDetails;

  if (!isValidDateString(birthDate)) {
    res.status(400).json({ message: "Invalid date format." });
    return;
  }

  const newUserId = generateUserUUID(email);

  const user = await UsersDAL.getUserById(newUserId);

  if (user) {
    res.status(409).json({ message: "User already exists." });
    return;
  }

  const newUser = await UsersDAL.createUser({
    ...req.body.userDetails,
    id: newUserId,
    birthDate: new Date(birthDate),
  });

  createAuthCookie(req, res, newUserId, email);

  res
    .status(201)
    .json({ message: "User registered successfully!", user: newUser });
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: UserDetails = req.body.userDetails;

  const user = await UsersDAL.getUserByEmailAndPassword(email, password);

  if (!user) {
    res.status(500).json({ message: "Invalid email or password." });
    return;
  }

  createAuthCookie(req, res, user.id, email);

  res.status(200).json({ message: "User logged in successfully!", user });
};

export { login, register };
