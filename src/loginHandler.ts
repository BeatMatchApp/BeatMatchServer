import { Request, Response } from 'express';
import { UsersDAL } from './dal/users';

export const loginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const user = await UsersDAL.getUserById(req.user.id);

  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  res.status(200).json({ user });
  return;
};
