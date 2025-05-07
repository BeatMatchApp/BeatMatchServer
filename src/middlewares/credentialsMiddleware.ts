import { Response, NextFunction, Request } from "express";
import { parseCredentialsCookie } from "../common/cookieParser";

export const credentialsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const credentialsCookie = req.cookies.user_credentials;

  if (!credentialsCookie) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userCredentials = parseCredentialsCookie(credentialsCookie);

    if (!userCredentials?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userCredentials = userCredentials;

    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid credentials format" });
  }
};
