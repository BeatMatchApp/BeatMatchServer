import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models';
import { dataAccess } from '../dal/dataAccess';
import { generateUserUUID } from '../common/userUUID';

export interface LoginUserDetails {
  email: string;
  password: string;
}

const accessTokenExpiration = parseInt(process.env.JWT_EXPIRATION_MILL || '50000');
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const saveRefreshTokens = async (userId: string, tokens: string[]) => {
  await dataAccess('public.users')
    .where({ id: userId })
    .update({ refreshTokens: JSON.stringify(tokens) });
};

const generateTokens = async (user: User) => {
  const payload = { id: user.id, email: user.email }
  const expiration = accessTokenExpiration;
  const options: SignOptions = { expiresIn: expiration };
  let updatedRefreshTokens: string[] = [];

  const accessToken = jwt.sign(payload, JWT_SECRET, options);
  const refreshToken = jwt.sign(
      payload,
      JWT_REFRESH_SECRET,
      options
  );

  if (!user.refreshTokens) {
    updatedRefreshTokens = [refreshToken];
  } else if (!user.refreshTokens.includes(refreshToken)) {
    updatedRefreshTokens = [...user.refreshTokens, refreshToken];
  } else {
    updatedRefreshTokens = user.refreshTokens;
  }

  saveRefreshTokens(user.id, updatedRefreshTokens)

  return {
    accessToken,
    refreshToken,
  };
};

const register = async (req: Request, res: Response) => {
  const { email, name, birthDate, password, country } = req.body;
    if (!email || !name || !birthDate || !password || !country) {
      return res.status(400).json({ message: 'Email, name, birthDate, password and country are required' });
    }
  try {
    const dbUser = await dataAccess('public.users').where({ email }).first();
    if (dbUser != null) {
      return res.status(406).send("email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await dataAccess('public.users')
      .insert({ id: generateUserUUID(email), email, name, birthDate, password: hashedPassword, country })
      .returning('*')
      .then(rows => rows[0]);

    const tokens = await generateTokens(user);
    res.cookie("refresh", tokens.refreshToken, {
      httpOnly: true,
      path: "/",
    });
    res.cookie("access", tokens.accessToken, {
      httpOnly: true,
      maxAge: accessTokenExpiration,
    });
    
    saveRefreshTokens(user.id, tokens.refreshToken);

    return res.status(201).json('ok');
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await dataAccess('public.users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    const tokens = await generateTokens(user);
    res.cookie("refresh", tokens.refreshToken, {
      httpOnly: true,
      path: "/",
    });
    res.cookie("access", tokens.accessToken, {
      httpOnly: true,
      maxAge: accessTokenExpiration,
    });

    saveRefreshTokens(user.id, tokens.refreshToken);

    return res.sendStatus(200);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

const logout = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(
    refreshToken,
    JWT_REFRESH_SECRET,
    async (err, user: LoginUserDetails) => {
      if (err) return res.sendStatus(401);
      try {
        const userDb = await dataAccess('public.users').where({ email: user.email }).first();
        if (
            !userDb.refreshTokens ||
            !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          saveRefreshTokens(userDb.id, userDb.refreshTokens)

          return res.sendStatus(401);
        } else {
          userDb.refreshTokens = userDb.refreshTokens.filter(
              (t) => t !== refreshToken
          );
          
          saveRefreshTokens(userDb.id, userDb.refreshTokens)
          
          res.clearCookie("refresh", { path: "/" });
          res.clearCookie("access");
          return res.sendStatus(200);
        }
      } catch (err) {
        res.sendStatus(401).send(err.message);
      }
    }
);
  return res.json({ message: 'Logged out successfully' });
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh;
  if (!refreshToken) return res.sendStatus(401);
  const options: SignOptions = { expiresIn: 3600 };
  jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET,
      async (err, user: LoginUserDetails ) => {
        if (err) {
          console.log(err);
          return res.sendStatus(401);
        }
        try {
          const userDb = await dataAccess('public.users').where({ email: user.email }).first();
          if (
              !userDb.refreshTokens ||
              !userDb.refreshTokens.includes(refreshToken)
          ) {
            userDb.refreshTokens = [];
            saveRefreshTokens(userDb.id, userDb.refreshTokens)
            return res.sendStatus(401);
          }
          const accessToken = jwt.sign(
              { id: userDb.id },
              process.env.JWT_SECRET,
              options
          );
          const newRefreshToken = jwt.sign(
              { id: userDb.id },
              process.env.JWT_REFRESH_SECRET
          );
          userDb.refreshTokens = userDb.refreshTokens.filter(
              (t) => t !== refreshToken
          );
          userDb.refreshTokens.push(newRefreshToken);
          saveRefreshTokens(userDb.id, userDb.refreshTokens)

          res.cookie("refresh", newRefreshToken, {
            httpOnly: true,
            path: "/",
          });
          res.cookie("access", accessToken, {
            httpOnly: true,
            maxAge: accessTokenExpiration,
          });
          return res.sendStatus(200);
        } catch (err) {
          res.status(401).send(err.message);
        }
      }
  );
};

export default { register, login, logout, refresh };
