import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { UsersDAL } from "../dal/users";
import { isValidDateString } from "../common/isValidDateString";
interface UserDetails {
  name: string;
  email: string;
  password: string;
  birthDate: string; // ISO date string
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body || !req.body.userDetails) {
      res.status(400).json({ error: "Missing user details." });
      return;
    }

    const { email, password, name, birthDate }: UserDetails =
      req.body.userDetails;

    if (!email || !password || !name || !birthDate) {
      res
        .status(400)
        .json({ error: "Missing Fields.", name, email, password, birthDate });
      return;
    }

    if (!isValidDateString(birthDate)) {
      res.status(400).json({ error: "Invalid date format." });
      return;
    }

    // Here you would typically hash the password and save the user to a database
    // For now, we'll just return a success message

    const newUser = await UsersDAL.createUser({
      id: randomUUID(),
      email,
      name,
      birthDate: new Date(birthDate),
    });

    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};

export const createNewUser = async () => {
  const newUser = await UsersDAL.createUser({
    id: randomUUID(),
    email: "test@example.com",
    name: "Test User",
    birthDate: new Date("2000-01-01"),
    country: "USA",
  });

  console.log("user created:", newUser);
};
