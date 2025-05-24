import { Request } from "express";
import { UserPreferences } from "../models";
import { UsersPreferencesDAL } from "../dal/usersPreferences";

const getUserPreferences = async (
  userId: string
): Promise<UserPreferences | undefined> => {
  const preferences: UserPreferences =
    await UsersPreferencesDAL.getPreferencesByUser(userId);

  return preferences;
};

const createUserPreferences = async (
  req: Request
): Promise<UserPreferences | undefined> => {
  const preferences: Omit<UserPreferences, "userId"> = req.body.preferences;

  if (
    !preferences.artists ||
    !preferences.genres ||
    !preferences.song ||
    !req.user
  ) {
    return;
  }

  const savedPreferences: UserPreferences =
    await UsersPreferencesDAL.createUserPreferences({
      ...preferences,
      userId: req.user.id,
    });

  return savedPreferences;
};

export { createUserPreferences, getUserPreferences };
