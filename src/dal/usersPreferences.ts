import { User, UserPreferences } from "../models";
import { dataAccess } from "./dataAccess";

const USERS_PREFERENCES_TABLE = "users_preferences";

const UsersPreferencesDAL = {
  async getPreferencesByUser(userId: string) {
    return await dataAccess(USERS_PREFERENCES_TABLE)
      .where({ userId: userId })
      .first();
  },

  async upsertUserPreferences(
    preferences: UserPreferences
  ): Promise<UserPreferences> {
    const [newPreferences] = await dataAccess(USERS_PREFERENCES_TABLE)
      .insert(preferences)
      .onConflict("userId")
      .merge()
      .returning("*");

    return newPreferences;
  },

  async deleteUserPreferences(userId: string) {
    return await dataAccess(USERS_PREFERENCES_TABLE)
      .where({ userId: userId })
      .del();
  },
};

export { UsersPreferencesDAL };
