import knex from "knex";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../models";

const JWT_EXPIRATION_MILL = process.env.JWT_EXPIRATION_MILL || '3600000';
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const generateTokens = (user: User) => {
  const payload = { id: user.id, email: user.email };

  const expirationTime = isNaN(Number(JWT_EXPIRATION_MILL)) ? '1h' : Number(JWT_EXPIRATION_MILL);

  const accessTokenOptions: SignOptions = {
    expiresIn: expirationTime,
  };

  const refreshTokenOptions: SignOptions = {
    expiresIn: '3600',
  };

  const accessToken = jwt.sign(payload, JWT_SECRET as string, accessTokenOptions);
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET as string, refreshTokenOptions);

  return { accessToken, refreshToken };
};

const register = async (req, res) => {
  const { email, name, birthDate, password, country } = req;

  if (!email || !name || !birthDate || !password || !country) {
    throw new Error('not all user param provided');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [user] = await knex('users').insert({
    email,
    name,
    birthDate,
    password: hashedPassword,
    country,
  }).returning('*');

  const { accessToken, refreshToken } = generateTokens(user);

  return { user, accessToken, refreshToken };
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error('no email or password provided');
  }
  
  const [user] = await knex('users').where({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const { accessToken, refreshToken } = generateTokens(user);

  return { user, accessToken, refreshToken };
};

const logout = () => {
  return { message: 'Logged out successfully' };
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new Error('no refreshToken provided');
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET as string) as { id: string, email: string };

    const [user] = await knex('users').where({ id: decoded.id });

    if (!user) {
      throw new Error('User not found');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

export default {
  register,
  login,
  logout,
  refresh,
};
