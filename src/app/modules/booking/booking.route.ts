import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../User/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { BookingValidation } from "./booking.validation";
import { BookingController } from "./booking.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.user),
  validateRequest(BookingValidation.createBookingSchema),
  BookingController.createBooking
);

router.get("/", auth(UserRole.admin), BookingController.getAllBooking);

router.get(
  "/my-bookings",
  auth(UserRole.user),
  BookingController.userSingleBooking
);

router.put(
  "/approve/:bookingId",
  auth(UserRole.admin),
  validateRequest(BookingValidation.approveBookingSchema),
  BookingController.approveBooking
);

router.put(
  "/payment/:bookingId",
  auth(UserRole.user),
  BookingController.paymentBooking
);

router.delete(
  "/cancel/:bookingId",
  auth(UserRole.admin, UserRole.user),
  BookingController.cancelBooking
);

export const BookingRoutes = router;
