import bcrypt from "bcrypt";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { UserRole, UserSearchableField } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(UserSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getUserIntoDB = async (currentUser: JwtPayload) => {
  const userExists = (await User.findOne({
    email: currentUser?.email,
  })) as TUser;

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!!");
  }

  return userExists;
};

const updateUserIntoDB = async (
  id: string,
  payload: Partial<TUser>,
  currentUser: JwtPayload
) => {
  const userExists = await User.findById(id);

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // non-admin users from updating role or isBlocked status
  if (currentUser.role !== UserRole.admin) {
    delete payload.role;
    delete payload.isBlocked;
  } else {
    // only admin permissions
    if (payload.role) {
      // only 'user' role users can be promoted to 'admin'
      if (
        userExists.role === UserRole.user &&
        payload.role === UserRole.admin
      ) {
        payload.role = UserRole.admin;
      } else if (
        userExists.role === UserRole.admin &&
        payload.role !== UserRole.admin
      ) {
        // Prevent changing roles of existing admins by other admins
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Admins cannot change the role of other admins"
        );
      }
    }
    // Admin can block/unblock users
    if (payload.isBlocked !== undefined) {
      payload.isBlocked = Boolean(payload.isBlocked);
    }
  }

  // hash new password if provided
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.salt_round)
    );
  }

  payload.name = payload.name || userExists.name;
  payload.email = payload.email || userExists.email;

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

export const UserService = {
  getAllUserFromDB,
  getUserIntoDB,
  updateUserIntoDB,
};
