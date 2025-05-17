import { Response } from "express";
import { UsersDAL } from "./dal/users";
import { CustomRequest } from "./models";

export const loginHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (req.user) {
    const user = await UsersDAL.getUserById(req.user.id);

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.status(200).json({ user });
    return;
  }
};
