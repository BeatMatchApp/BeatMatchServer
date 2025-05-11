import { Request, Response } from "express";
import { UserPreferences } from "../models";
import * as UserPreferencesBL from "../bls/userPreferences";

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
      await UserPreferencesBL.createUserPreferences(req);

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
