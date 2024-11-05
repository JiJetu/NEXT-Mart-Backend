import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const { bookingId, ...remainingData } = req.body;
  const user = req.user;

  const result = await ReviewService.createReviewIntoDB(
    bookingId,
    remainingData,
    user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review post successfully",
    data: result,
  });
});

const getAllReview = catchAsync(async (req, res) => {
  const result = await ReviewService.getAllBookingFromDB();

  if (Object.keys(result).length <= 0) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: result,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const specificCarReview = catchAsync(async (req, res) => {
  const { carId } = req.params;

  const result = await ReviewService.getSpecificCarReviewFromDB(carId);

  if (Object.keys(result).length <= 0) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: result,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Bookings retrieved successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReview,
  specificCarReview,
};
