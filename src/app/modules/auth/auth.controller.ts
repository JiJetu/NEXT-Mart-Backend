import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";

const registerUser = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await AuthServices.signUpIntoDB(req.body, user);

  const { password, ...remainingUserData } = result.toObject();

  console.log(password);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User logged in successfully",
    data: remainingUserData,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.logInIntoDB(req.body);

  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result.user,
    token: `${result?.accessToken}`,
  });
});

// const refreshToken = catchAsync(async (req, res) => {
//   const { refreshToken } = req.cookies;

//   const result = await AuthServices.refreshToken(refreshToken);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Access token is retrieved succesfully!",
//     data: result,
//   });
// });

// const forgetPassword = catchAsync(async (req, res) => {
//   const { email } = req.body;

//   const result = await AuthServices.forgetPassword(email);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Reset link generated successfully!",
//     data: result,
//   });
// });

// const resetPassword = catchAsync(async (req, res) => {
//   const token = req.headers.authorization;

//   const result = await AuthServices.resetPassword(req.body, token as string);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Password reset successfully!",
//     data: result,
//   });
// });

export const AuthController = {
  loginUser,
  registerUser,
};
