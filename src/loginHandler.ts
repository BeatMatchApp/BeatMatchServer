import { Request, Response } from "express";

interface UserCredentials {
  id: string;
  spotify_access_token: string;
  spotify_refresh_token: string;
}

export const loginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const credentialsCookie = req.cookies.user_credantials;
  if (!credentialsCookie) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const parsedCredentials = decodeURIComponent(credentialsCookie);
  const userCredentials: UserCredentials = JSON.parse(parsedCredentials);
};
