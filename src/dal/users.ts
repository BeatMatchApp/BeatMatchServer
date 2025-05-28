import { User } from "../models";
import { UpdateUserInput } from "../models/interfaces/User";
import { dataAccess } from "./dataAccess";
import bcrypt from "bcrypt";

const USERS_TABLE = "users";

const UsersDAL = {
  async getAllUsers() {
    return await dataAccess(USERS_TABLE).select("*");
  },

  async getUserById(id: string) {
    return await dataAccess(USERS_TABLE).where({ id }).first();
  },

  async getUserByEmailAndPassword(email: string, password: string) {
    const user: User = await dataAccess(USERS_TABLE).where({ email }).first();

    if (!user) {
      return undefined;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      return user;
    } else {
      return undefined;
    }
  },

  async createUser(user: User) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    return await dataAccess(USERS_TABLE)
      .insert(user)
      .onConflict("id")
      .merge()
      .returning("*");
  },

  async updateUser(id: User["id"], user: UpdateUserInput) {
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
