import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const getAllUser = catchAsync(async (req, res) => {
  const query = req?.query;

  const result = await UserService.getAllUserFromDB(query);

  if (Object.keys(result).length <= 0) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      meta: result.meta,
      data: result.result,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await UserService.getUserIntoDB(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = req.user;
  const result = await UserService.updateUserIntoDB(userId, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

export const UserController = {
  getAllUser,
  getUser,
  updateUser,
};
