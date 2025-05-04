import { User, UserPreferences } from "../models";
import { dataAccess } from "./dataAccess";

const USERS_PREFERENCES_TABLE = "users_preferences";

const UsersPreferencesDAL = {
  async getPreferencesByUser(userId: string) {
    return await dataAccess(USERS_PREFERENCES_TABLE)
      .where({ userId: userId })
      .first();
  },

  async createUserPreferences(preferences: UserPreferences) {
    return await dataAccess(USERS_PREFERENCES_TABLE)
      .insert(preferences)
      .returning("*");
  },

  async deleteUserPreferences(userId: string) {
    return await dataAccess(USERS_PREFERENCES_TABLE)
      .where({ userId: userId })
      .del();
  },
};

export { UsersPreferencesDAL };
