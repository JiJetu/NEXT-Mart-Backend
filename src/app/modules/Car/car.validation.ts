import { z } from "zod";
import { CarStatus } from "./car.constant";

const createCarValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").trim(),
    description: z.string().min(1, "Description is required").trim(),
    color: z.string().min(1, "Color is required").trim(),
    isElectric: z.boolean(),
    status: z.nativeEnum(CarStatus).default(CarStatus.available),
    features: z.array(z.string()).default([]),
    pricePerHour: z
      .number()
      .positive("Price per hour must be a positive number"),
    isDeleted: z.boolean().default(false),
  }),
});

const updateCarValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").trim().optional(),
    description: z.string().min(1, "Description is required").trim().optional(),
    color: z.string().min(1, "Color is required").trim().optional(),
    isElectric: z.boolean().optional(),
    status: z.nativeEnum(CarStatus).optional(),
    features: z.array(z.string()).optional(),
    pricePerHour: z
      .number()
      .positive("Price per hour must be a positive number")
      .optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const CarValidations = {
  createCarValidationSchema,
  updateCarValidationSchema,
};
