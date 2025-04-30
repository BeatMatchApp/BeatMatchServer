import { UserCredentials } from "../../models";

declare global {
  namespace Express {
    interface Request {
      userCredentials?: {
        id: string;
        spotify_access_token: string;
        spotify_refresh_token: string;
      };
    }
  }
}

export {};
