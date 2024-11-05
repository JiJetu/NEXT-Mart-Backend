import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Car } from "../Car/car.model";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../User/user.model";
import { CarStatus } from "../Car/car.constant";
import { UserRole } from "../User/user.constant";
import { initiatePayment } from "../payment/payment.utils";
import crypto from "crypto";

const createBookingIntoDB = async (
  carId: string,
  payload: Partial<TBooking>,
  user: JwtPayload
) => {
  // check car is exists
  const carExists = await Car.findByIdAndUpdate(
    carId,
    { status: CarStatus.unavailable },
    { new: true }
  );

  if (!carExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Car is not found!!");
  }

  // check user is exists
  const userExists = await User.findOne({ email: user?.email });

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!!");
  }

  // set transactionId

  const hash = crypto
    .createHash("sha256")
    .update(userExists.email + Date.now().toString())
    .digest("hex")
    .slice(0, 10);

  payload.transactionId = `tex-${hash}`;
  payload.car = carExists._id;
  payload.user = userExists._id;

  const result = (
    await (await Booking.create(payload)).populate("user")
  ).populate("car");

  return result;
};

const getAllBookingFromDB = async (query: Record<string, unknown>) => {
  const { carId, date, bookingConfirm, canceledBooking } = query;
  const queryObj: any = {};
  if (carId) {
    queryObj.car = carId;
  }
  if (date) {
    queryObj.startDate = date;
  }
  if (bookingConfirm) {
    queryObj.bookingConfirm = bookingConfirm;
  }
  if (canceledBooking) {
    queryObj.canceledBooking = canceledBooking;
  }
  const result = await Booking.find(queryObj).populate("user").populate("car");

  return result;
};

const userSingleBookingFromDB = async (user: JwtPayload) => {
  const userExists = await User.findOne({ email: user?.email });
  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!!");
  }

  const result = await Booking.find({ user: userExists._id })
    .populate("user")
    .populate("car");

  return result;
};

const approveBooking = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.bookingConfirm) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking already approved");
  }

  if (booking.canceledBooking) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking already canceled");
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { bookingConfirm: true },
    { new: true }
  )
    .populate("user")
    .populate("car");

  return updatedBooking;
};

const paymentBooking = async (bookingId: string, user: JwtPayload) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const userExists = await User.findOne({ email: user?.email });

  if (!userExists || userExists.role === UserRole.admin) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
  }

  if (!booking.user.equals(userExists._id) || !booking.totalCost) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to pay the  cost"
    );
  }

  if (booking.paymentStatus) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment already paid!");
  }

  // // todo: change as true
  // booking.paymentStatus = false;
  // await booking.save();

  // // // update payment status as true
  // // await Booking.findById(bookingId).populate("user").populate("car");

  // payment
  const paymentInfo = {
    transactionId: booking.transactionId,
    totalCost: booking.totalCost,
    userName: userExists.name,
    userEmail: userExists.email,
    userAddress: userExists.address,
    userPhone: userExists.phone,
  };

  const paymentSession = await initiatePayment(paymentInfo);

  return paymentSession;
};

const cancelBooking = async (bookingId: string, user: JwtPayload) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const userExists = await User.findOne({ email: user?.email });

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!!");
  }

  if (
    !booking.user.equals(userExists._id) &&
    userExists.role !== UserRole.admin
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to cancel this booking"
    );
  }
  // if (!userExists || userExists.role !== UserRole.admin) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
  // }

  if (booking.bookingConfirm) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel an approved booking"
    );
  }

  if (!booking.createdAt) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking creation date");
  }

  // checking if cancellation is requested within 24 hours of the start time
  const hoursSinceBooking =
    (Date.now() - new Date(booking.createdAt).getTime()) / (1000 * 60 * 60);

  if (UserRole.user && booking.user.equals(userExists._id)) {
    if (hoursSinceBooking > 24) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cancellation is only allowed within 24 hours of bookings"
      );
    }
  }

  // update car status as available
  const car = await Car.findByIdAndUpdate(
    booking?.car,
    { status: CarStatus.available },
    { new: true }
  );

  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { canceledBooking: true },
    { new: true }
  )
    .populate("user")
    .populate("car");

  return updatedBooking;
};

// const updateCarIntoDB = async (id: string, payload: Partial<TBooking>) => {
//   const carExists = await Booking.findById(id);

//   if (!carExists) {
//     throw new AppError(httpStatus.NOT_FOUND, "Car is not found!!");
//   }

//   const result = await Booking.findByIdAndUpdate(id, payload, {
//     new: true,
//   });

//   return result;
// };

// const deleteCarIntoDB = async (id: string) => {
//   const deletedUser = await Booking.findByIdAndUpdate(
//     id,
//     { isDeleted: true },
//     { new: true }
//   );

//   if (!deletedUser) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
//   }
//   return deletedUser;
// };

export const BookingService = {
  createBookingIntoDB,
  getAllBookingFromDB,
  userSingleBookingFromDB,
  approveBooking,
  cancelBooking,
  paymentBooking,
};
