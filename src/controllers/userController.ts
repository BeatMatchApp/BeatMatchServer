import { Request, Response } from "express";

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

    // Here you would typically hash the password and save the user to a database
    // For now, we'll just return a success message

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};
