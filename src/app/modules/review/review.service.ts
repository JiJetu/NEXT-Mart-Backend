import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { TReview } from "./review.interface";
import AppError from "../../errors/AppError";
import { Car } from "../Car/car.model";
import { User } from "../User/user.model";
import { Review } from "./review.model";
import { Booking } from "../booking/booking.model";

const createReviewIntoDB = async (
  bookingId: string,
  payload: Partial<TReview>,
  user: JwtPayload
) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { reviewStatus: true },
    { new: true }
  );

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  // check user is exists
  const userExists = await User.findOne({ email: user?.email });

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!!");
  }

  const car = await Car.findById(booking.car);

  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, "Car is not found!!");
  }

  if (!booking.user.equals(userExists._id)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to write review"
    );
  }

  car.ratingCount += 1;
  const userRatting = payload?.rating || 5;
  car.ratingSum += userRatting;

  // Calculate new average rating
  car.averageRating = Math.round(car.ratingSum / car.ratingCount);

  // Save the car with the updated rating information
  await car.save();

  payload.user = userExists._id;
  payload.car = booking.car;

  const result = (
    await (await Review.create(payload)).populate("user")
  ).populate("car");

  return result;
};

const getAllBookingFromDB = async () => {
  const result = await Review.find().populate("user").populate("car");

  return result;
};

const getSpecificCarReviewFromDB = async (carId: string) => {
  const carExists = await Car.findById(carId);

  if (!carExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Car is not found!!");
  }

  const result = await Review.find({ car: carExists._id })
    .populate("user")
    .populate("car");

  return result;
};

export const ReviewService = {
  createReviewIntoDB,
  getAllBookingFromDB,
  getSpecificCarReviewFromDB,
};
