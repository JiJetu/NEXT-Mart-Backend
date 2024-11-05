import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";
import { UserRole } from "../User/user.constant";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.user),
  validateRequest(ReviewValidation.createReviewSchema),
  ReviewController.createReview
);

router.get("/", ReviewController.getAllReview);

router.get("/car-reviews/:carId", ReviewController.specificCarReview);

export const ReviewRoutes = router;
