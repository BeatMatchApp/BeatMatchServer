import { Request, Response } from "express";
import { UserPreferences } from "../models";
import * as UserPreferencesBL from "../bls/userPreferences";
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

    const savedPreferences: UserPreferences | undefined =
      await UserPreferencesBL.upsertUserPreferences(req);

    if (savedPreferences) {
      res.status(200).json({
        message: `preferences for user ${savedPreferences.userId} saved successfully!`,
      });
    } else {
      res
        .status(500)
        .json({ error: "An error occurred while saving preferences." });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving preferences." });
  }
};

export const getPreferences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.user.id;
    const preferences: UserPreferences | undefined =
      await UsersPreferencesDAL.getPreferencesByUser(userId);

    if (preferences) {
      res.status(200).json(preferences);
    } else {
      res.status(404).json({ message: "Preferences not found." });
    }
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching preferences." });
  }
};
