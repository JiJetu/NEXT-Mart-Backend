import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

const createBooking = catchAsync(async (req, res) => {
  const { carId, ...remainingData } = req.body;
  const user = req.user;

  const result = await BookingService.createBookingIntoDB(
    carId,
    remainingData,
    user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car booked successfully",
    data: result,
  });
});

const getAllBooking = catchAsync(async (req, res) => {
  const query = req?.query;

  const result = await BookingService.getAllBookingFromDB(query);

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
    message: "Bookings retrieved successfully",
    data: result,
  });
});

const userSingleBooking = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await BookingService.userSingleBookingFromDB(user);

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

const approveBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.params;

  const result = await BookingService.approveBooking(bookingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking approved successfully",
    data: result,
  });
});

const paymentBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const user = req.user;

  const result = await BookingService.paymentBooking(bookingId, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment paid successfully",
    data: result,
  });
});

const cancelBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const user = req.user;

  const result = await BookingService.cancelBooking(bookingId, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking canceled successfully",
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getAllBooking,
  userSingleBooking,
  approveBooking,
  cancelBooking,
  paymentBooking,
};
