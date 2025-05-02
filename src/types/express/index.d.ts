import { UserCredentials } from "../../models";

declare global {
  namespace Express {
    interface Request {
      userCredentials?: UserCredentials;
    }
  }
}

export {};
