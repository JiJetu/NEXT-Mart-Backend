import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TCar, TReturnCar } from "./car.interface";
import { Car } from "./car.model";
import { JwtPayload } from "jsonwebtoken";
import { Booking } from "../booking/booking.model";
import { User } from "../User/user.model";
import mongoose from "mongoose";
import { CarSearchableField, CarStatus } from "./car.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import { UserRole } from "../User/user.constant";

const createCarIntoDB = async (payload: TCar) => {
  const result = await Car.create(payload);

  return result;
};

const getAllCarFromDB = async (query: Record<string, unknown>) => {
  const carQuery = new QueryBuilder(Car.find(), query)
    .search(CarSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await carQuery.modelQuery;
  const meta = await carQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleCarFromDB = async (id: string) => {
  const result = await Car.findById(id);

  return result;
};

const updateCarIntoDB = async (id: string, payload: Partial<TCar>) => {
  const carExists = await Car.findById(id);

  if (!carExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Car is not found!!");
  }

  const result = await Car.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

const returnCardIntoDB = async (user: JwtPayload, payload: TReturnCar) => {
  const userExists = await User.findOne({ email: user.email });

  if (!userExists || userExists.role !== UserRole.admin) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const booking = await Booking.findById(payload?.bookingId)
      .populate("user")
      .populate("car");

    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
    }

    booking.endDate = payload.endDate;
    booking.endTime = payload.endTime;

    // combine start date and time, and end date and time into Date objects
    const startDateTime = new Date(`${booking.startDate}T${booking.startTime}`);
    const endDateTime = new Date(`${payload.endDate}T${payload.endTime}`);

    if (startDateTime >= endDateTime) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "End date and time must be after start date and time"
      );
    }

    // calculate duration in hours
    const durationInHours =
      (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

    // update car status as available
    const car = await Car.findByIdAndUpdate(
      booking?.car,
      { status: CarStatus.available },
      { new: true, session }
    );

    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, "Car not found");
    }

    // Calculate additional feature cost at $20 per feature
    const featureCost = (booking?.additionalFeatures.length * 20) | 0;
    const insuranceCost = (booking?.additionalInsurance.length * 40) | 0;

    const baseCost =
      durationInHours * car?.pricePerHour + featureCost + insuranceCost;

    const taxAmount = baseCost * 0.1;

    // Calculate total cost including tax
    booking.totalCost = baseCost + taxAmount;

    await booking.save({ session });

    await session.commitTransaction();
    await session.endSession();

    return booking;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};

const deleteCarIntoDB = async (id: string) => {
  const deletedUser = await Car.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!deletedUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
  }
  return deletedUser;
};

export const CarService = {
  createCarIntoDB,
  getAllCarFromDB,
  getSingleCarFromDB,
  updateCarIntoDB,
  deleteCarIntoDB,
  returnCardIntoDB,
};
