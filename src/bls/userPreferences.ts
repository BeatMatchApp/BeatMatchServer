import { Request } from 'express';
import { UserPreferences } from '../models';
import { UsersPreferencesDAL } from '../dal/usersPreferences';

const getUserPreferences = async (
  userId: string
): Promise<UserPreferences | undefined> => {
  const preferences: UserPreferences =
    await UsersPreferencesDAL.getPreferencesByUser(userId);

  return preferences;
};

const upsertUserPreferences = async (
  req: Request
): Promise<UserPreferences | undefined> => {
  const preferences: Omit<UserPreferences, 'userId'> = req.body.preferences;

  if (
    !preferences.artists ||
    !preferences.genres ||
    !preferences.song ||
    !req.user
  ) {
    return;
  }

  const savedPreferences: UserPreferences =
    await UsersPreferencesDAL.upsertUserPreferences({
      ...preferences,
      userId: req.user.id,
    });

  return savedPreferences;
};

export { upsertUserPreferences, getUserPreferences };
