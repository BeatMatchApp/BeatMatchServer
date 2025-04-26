import { Request } from "express";
import { UserCredentials } from "../interfaces/UserCredentials";

export interface CustomRequest extends Request {
  userCredentials: UserCredentials;
}
