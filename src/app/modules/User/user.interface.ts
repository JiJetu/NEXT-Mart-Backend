/* eslint-disable no-unused-vars */

import { Model } from "mongoose";
import { UserRole } from "./user.constant";

export type TUserRole = keyof typeof UserRole;

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  needsPasswordChange: boolean;
  isBlocked: boolean;
};

// for creating static
export interface UserModel extends Model<TUser> {
  isUserExists(email: string): Promise<TUser>;
}
