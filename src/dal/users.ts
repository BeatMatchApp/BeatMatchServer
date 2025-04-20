import { User } from "../models";
import { dataAccess } from "./dataAccess";

const USERS_TABLE = "users";

const UsersDAL = {
  async getAllUsers() {
    return await dataAccess(USERS_TABLE).select("*");
  },

  async getUserById(id: string) {
    return await dataAccess(USERS_TABLE).where({ id }).first();
  },

  async createUser(user: User) {
    return await dataAccess(USERS_TABLE).insert(user).returning("*");
  },

  async updateUser(id: string, user: User) {
    return await dataAccess(USERS_TABLE)
      .where({ id })
      .update(user)
      .returning("*");
  },

  async deleteUser(id: string) {
    return await dataAccess(USERS_TABLE).where({ id }).del();
  },
};

export { UsersDAL };
