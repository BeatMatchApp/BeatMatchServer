import { randomUUID } from "crypto";
import { UsersDAL } from "../dal/users";

export const createNewUser = async () => {
  const newUser = await UsersDAL.createUser({
    id: randomUUID(),
    email: "test@example.com",
    name: "Test User",
    birthDate: new Date("2000-01-01"),
    country: "USA",
  });

  console.log("user created:", newUser);
};
