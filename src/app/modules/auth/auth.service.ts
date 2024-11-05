import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { User } from "../User/user.model";
import { TUser } from "./../User/user.interface";
import { TLogIn } from "./auth.interface";
import { createToken, isPasswordMatch } from "./auth.utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

const signUpIntoDB = async (payload: TUser, user: JwtPayload) => {
  const adminExists = await User.findOne({ email: user?.email });

  if (!adminExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const isUserExists = await User.isUserExists(payload.email);

  if (isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User is already exists");
  }

  const result = await User.create(payload);
  return result;
};

const logInIntoDB = async (payload: TLogIn) => {
  // finding user is exists or not and getting the password to verify
  const userExists = await User.findOne({ email: payload.email }).select(
    "+password"
  );

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }

  // checking password is matching or not with plain pass(request pass) and hash pass(DB pass)
  const matchedPassword = await isPasswordMatch(
    payload.password,
    userExists?.password
  );

  if (!matchedPassword) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid password");
  }

  const jwtPayload = {
    email: userExists.email,
    role: userExists.role,
  };

  // creating access token
  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.jwt_access_expires_in as string
  );

  // creating refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.jwt_refresh_expires_in as string
  );

  const { password, ...remainingUserData } = userExists.toObject();

  return {
    user: remainingUserData,
    refreshToken,
    accessToken,
  };
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.JWT_REFRESH_SECRET as string
  ) as JwtPayload;

  const { email } = decoded;
  // const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  if (user?.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, "his user is blocked!");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    "10m"
  );

  const resetUILink = `${config.reset_pass_ui_link}?email=${user.email}&token=${resetToken}`;

  sendEmail(user.email, resetUILink);
  return;
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string
) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  if (user?.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, "his user is blocked!");
  }

  const decoded = jwt.verify(
    token,
    config.JWT_ACCESS_SECRET as string
  ) as JwtPayload;

  if (payload.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, "You are forbidden!");
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.salt_round)
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
    }
  );
  return;
};

export const AuthServices = {
  signUpIntoDB,
  logInIntoDB,
  refreshToken,
  forgetPassword,
  resetPassword,
};
