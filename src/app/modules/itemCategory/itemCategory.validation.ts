import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Category name is required" }).min(1),
    description: z.string({ required_error: "Description is required" }).min(1),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
