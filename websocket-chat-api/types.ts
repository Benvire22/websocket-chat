import { Model } from 'mongoose';

export interface IncomingMessage {
  type: string;
  payload: string;
}

export interface UserMessage {
  user: string;
  message: string;
}

export interface UserFields {
  username: string;
  password: string;
  displayName: string;
  token: string;
  role: string;
  googleID?: string;
  avatar: string | null;
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;