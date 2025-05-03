import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models';
import { generateUserUUID } from '../common/userUUID';
import { HOUR } from '../consts/general';
import { UsersDAL } from '../dal/users';

export interface LoginUserDetails {
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const generateTokens = async (user: User) => {
  const payload = { id: user.id, email: user.email };
  const options: SignOptions = { expiresIn: HOUR };
  const accessToken = jwt.sign(payload, JWT_SECRET, options);
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, options);
  return { accessToken, refreshToken };
};

const register = async (req: Request, res: Response) => {
  const { email, name, birthDate, password, country } = req.body;
  if (!email || !name || !birthDate || !password || !country) {
    return res.status(400).json({ message: 'Email, name, birthDate, password and country are required' });
  }
  try {
    const userDb = await UsersDAL.getUserByEmailAndPassword(email, password);
    if (userDb != null) {
      return res.status(406).send("email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userToSave = {id: generateUserUUID(email), email, name, birthDate, password: hashedPassword, country}
    const user = await UsersDAL.createUser(userToSave)

    const tokens = await generateTokens(userToSave);
    res.cookie("refresh", tokens.refreshToken, {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "lax",
      maxAge: HOUR,
    });
    res.cookie("access", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: HOUR,
    });

    return res.status(201).json('ok');
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body.userDetails;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await UsersDAL.getUserByEmailAndPassword(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const tokens = await generateTokens(user);
    res.cookie("refresh", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: HOUR,
    });
    res.cookie("access", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: HOUR,
    });

    return res.sendStatus(200);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

const logout = (_req: Request, res: Response) => {
  res.clearCookie("refresh");
  res.clearCookie("access");
  return res.status(200).json({ message: 'Logged out successfully' });
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh;
  if (!refreshToken) return res.sendStatus(401);
  const options: SignOptions = { expiresIn: 3600 };
  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decoded: jwt.JwtPayload | string | undefined) => {
    if (err) return res.sendStatus(401);
    try {
      const { email, password} = decoded as jwt.JwtPayload;
      const user = await UsersDAL.getUserByEmailAndPassword(email, password);
      if (!user) return res.sendStatus(401);

      const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, options);
      const newRefreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_REFRESH_SECRET);

      res.cookie("refresh", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: HOUR,
      });
      res.cookie("access", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: HOUR,
      });

      return res.sendStatus(200);
    } catch (err) {
      res.status(401).send(err.message);
    }
  });
};

export default { register, login, logout, refresh };