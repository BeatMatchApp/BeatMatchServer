import { UserCredentials } from "../models";

export const parseCredentialsCookie = (
  credentialsCookie: string
): UserCredentials => {
  const parsedCredentials = decodeURIComponent(credentialsCookie);
  const userCredentials: UserCredentials = JSON.parse(parsedCredentials);

  return userCredentials;
};
