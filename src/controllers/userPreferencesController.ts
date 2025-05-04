import { Request, Response } from "express";
import { UserPreferences } from "../models";
import { UsersPreferencesDAL } from "../dal/usersPreferences";

export const upsertPreferences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body || !req.body.preferences) {
      res.status(400).json({ message: "Missing preferences." });
      return;
    }

    const preferences: UserPreferences = {
      ...req.body.preferences,
      userId: req.userCredentials?.id,
    };

    if (!preferences.artists || !preferences.genres) {
      res.status(400).json({ message: "Missing preferences" });
      return;
    }

    await UsersPreferencesDAL.createUserPreferences(preferences);

    res.status(200).json({
      message: `preferences for user ${preferences.userId} saved successfully!`,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "An error occurred while registering." });
  }
};
