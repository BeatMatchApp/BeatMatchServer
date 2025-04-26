import { Response, NextFunction } from "express";
import { CustomRequest, UserCredentials } from "../models";

export const credentialsMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const credentialsCookie = req.cookies.user_credentials;
  if (!credentialsCookie) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const parsedCredentials = decodeURIComponent(credentialsCookie);
    const userCredentials: UserCredentials = JSON.parse(parsedCredentials);

    if (!userCredentials?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userCredentials = userCredentials;

    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid credentials format" });
  }
};
