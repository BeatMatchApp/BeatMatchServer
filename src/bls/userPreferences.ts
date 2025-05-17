import { Request } from "express";
import { UserPreferences } from "../models";
import { UsersPreferencesDAL } from "../dal/usersPreferences";

const createUserPreferences = async (
  req: Request
): Promise<UserPreferences | undefined> => {
  const preferences: Omit<UserPreferences, "userId"> = req.body.preferences;

  if (!preferences.artists || !preferences.genres || !req.user) {
    return;
  }

  const savedPreferences: UserPreferences =
    await UsersPreferencesDAL.createUserPreferences({
      ...preferences,
      userId: req.user.id,
    });

  return savedPreferences;
};

export { createUserPreferences };
