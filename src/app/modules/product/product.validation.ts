import { z } from "zod";

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Product name is required" }),
    description: z.string({ required_error: "Description is required" }),
    price: z.number({ required_error: "Price is required" }).positive(),
    stockQuantity: z.number().int().min(1).optional(),
    category: z.string({ required_error: "Category ID is required" }),
    images: z.array(z.string()).optional(),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stockQuantity: z.number().int().min(0).optional(),
    category: z.string().optional(),
    images: z.array(z.string()).optional(),
  }),
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
