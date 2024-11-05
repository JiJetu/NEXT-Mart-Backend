import express from "express";
import { CarControllers } from "./car.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CarValidations } from "./car.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "../User/user.constant";
import { BookingValidation } from "../booking/booking.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.admin),
  validateRequest(CarValidations.createCarValidationSchema),
  CarControllers.createCar
);

router.get("/", CarControllers.getAllCar);

router.get("/:carId", CarControllers.getSingleCar);

router.put(
  "/return",
  auth("admin"),
  validateRequest(BookingValidation.returnCarSchema),
  CarControllers.returnCar
);

router.put(
  "/:carId",
  auth(UserRole.admin),
  validateRequest(CarValidations.updateCarValidationSchema),
  CarControllers.updateCar
);

router.delete("/:carId", auth(UserRole.admin), CarControllers.deleteCar);

export const CarRoutes = router;
