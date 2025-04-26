import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models';
import { dataAccess } from '../dal/dataAccess';

const JWT_EXPIRATION_MILL = process.env.JWT_EXPIRATION_MILL || '3600000';
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const generateTokens = (user: User) => {
  const payload = { id: user.id, email: user.email };
  const expirationTime = isNaN(Number(JWT_EXPIRATION_MILL)) ? '1h' : Number(JWT_EXPIRATION_MILL);
  const accessTokenOptions: SignOptions = { expiresIn: expirationTime };
  const refreshTokenOptions: SignOptions = { expiresIn: '3600' };
  const accessToken = jwt.sign(payload, JWT_SECRET, accessTokenOptions);
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, refreshTokenOptions);
  return { accessToken, refreshToken };
};

const register = async (req: Request, res: Response) => {
  try {
    const { email, name, birthDate, password, country } = req.body;
    if (!email || !name || !birthDate || !password || !country) {
      return res.status(400).json({ message: 'Email, name, birthDate, password and country are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await dataAccess('public.users')
      .insert({ email, name, birthDate, password: hashedPassword, country })
      .returning('*')
      .then(rows => rows[0]);
    const { accessToken, refreshToken } = generateTokens(user);
    return res.json({ 
      user: { id: user.id, email: user.email, name: user.name, birthDate: user.birthDate, country: user.country },
      accessToken,
      refreshToken
    });
  } catch (err: any) {
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
    const { accessToken, refreshToken } = generateTokens(user);
    return res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

const logout = (_req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
};

const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string; email: string };
    const user = await dataAccess('public.users').where({ id: decoded.id }).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const tokens = generateTokens(user);
    return res.json(tokens);
  } catch (err: any) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export default { register, login, logout, refresh };
