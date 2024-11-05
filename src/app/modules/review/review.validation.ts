import { z } from "zod";

const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1, { message: "Car ID is required" }),
    rating: z.number().min(1, { message: "Rating is required " }),
    userReview: z.string().min(1, "User Review is required").trim(),
  }),
});

export const ReviewValidation = {
  createReviewSchema,
};
