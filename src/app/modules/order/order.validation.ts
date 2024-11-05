import { z } from "zod";
import { orderStatus } from "./order.constant";

const createOrderValidationSchema = z.object({
  body: z.object({
    user: z.object({
      name: z.string().min(1, { message: "Name is required" }),
      email: z.string().email({ message: "Invalid email address" }),
      phone: z.string().min(1, { message: "Phone number is required" }),
      address: z.string().min(1, { message: "Address is required" }),
    }),
    products: z
      .array(
        z.object({
          product: z.string().min(1, { message: "Product ID is required" }),
          quantity: z
            .number()
            .min(1, { message: "Quantity must be at least 1" }),
        })
      )
      .nonempty({ message: "At least one product is required" }),
    totalAmount: z
      .number()
      .positive({ message: "Total amount must be positive" }),
    transactionId: z.string().min(1, { message: "Transaction ID is required" }),
    paymentStatus: z.boolean().optional(),
  }),
});

const updateOrderValidationSchema = z.object({
  body: z.object({
    orderStatus: z.nativeEnum(orderStatus).optional(),
  }),
});

export const OrderValidations = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
