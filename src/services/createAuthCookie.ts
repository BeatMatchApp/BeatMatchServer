import { Request, Response } from "express";
import { HOUR, JWT_REFRESH_SECRET, JWT_SECRET } from "../consts/general";
import jwt, { SignOptions } from 'jsonwebtoken';
import { UsersDAL } from "../dal/users";

export const createAuthCookie = (
  req: Request,
  res: Response,
  userId: string,
  userEmail: string
) => {
  const payload = { id: userId, email: userEmail };
  const options: SignOptions = { expiresIn: HOUR };
  const accessToken = jwt.sign(payload, JWT_SECRET, options);
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, options);

  res.cookie("access", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: HOUR,
  });
  res.cookie("refresh", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: HOUR,
  });
};

export const refreshToken = (  
  req: Request,
  res: Response,
  userId: string,
  userEmail: string
) => {
  const refreshToken = req.cookies.refresh;
  if (!refreshToken) return res.sendStatus(401);
  
  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decoded: jwt.JwtPayload | string | undefined) => {
    if (err) return res.sendStatus(401);
    try {
      const { email, password} = decoded as jwt.JwtPayload;
      const user = await UsersDAL.getUserByEmailAndPassword(email, password);
      if (!user) return res.sendStatus(401);

      createAuthCookie( req, res, userId, userEmail)

      return res.sendStatus(200);
    } catch (err) {
      res.status(401).send(err.message);
    }
  });
}