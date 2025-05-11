import { Request, Response } from "express";
import { UserPreferences } from "../models";
import { UsersPreferencesDAL } from "../dal/usersPreferences";

const createUserPreferences = async (
  req: Request
): Promise<UserPreferences | undefined> => {
  const preferences: Omit<UserPreferences, "userId"> = req.body.preferences;

  if (!preferences.artists || !preferences.genres || !req.userCredentials) {
    return;
  }

  const savedPreferences: UserPreferences =
    await UsersPreferencesDAL.createUserPreferences({
      ...preferences,
      userId: req.userCredentials.id,
    });

  return savedPreferences;
};

export { createUserPreferences };
