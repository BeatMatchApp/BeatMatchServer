import { Request, Response } from "express";
import { UsersDAL } from "../dal/users";
import { isValidDateString } from "../common/isValidDateString";
import { generateUserUUID } from "../common/userUUID";
import { HOUR } from "../consts/general";
interface UserDetails {
  name: string;
  email: string;
  password: string;
  birthDate: string; // ISO date string
}

export const register = async (req: Request, res: Response): Promise<void> => {
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
      id: newUserId,
      email,
      name,
      birthDate: new Date(birthDate),
      password,
    });

    res.cookie(
      "user_credantials",
      JSON.stringify({
        id: newUserId,
        spotify_access_token: req.cookies.spotify_access_token,
        spotify_refresh_token: req.cookies.spotify_refresh_token,
      }),
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: HOUR,
      }
    );

    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "An error occurred while registering." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
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

    const user = await UsersDAL.getUserByEmailAndPassword(email, password);

    // Here you would typically check the hashed password against the stored hash
    // For now, we'll just return a success message

    if (!user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    res.cookie(
      "user_credantials",
      JSON.stringify({
        id: user.id,
        spotify_access_token: req.cookies.spotify_access_token,
        spotify_refresh_token: req.cookies.spotify_refresh_token,
      }),
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: HOUR,
      }
    );

    res.status(200).json({ message: "User logged in successfully!", user });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "An error occurred while logging in." });
  }
};
