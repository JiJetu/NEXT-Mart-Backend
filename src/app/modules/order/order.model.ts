import { Schema, model } from "mongoose";
import { orderStatus } from "./order.constant";
import { TOrder } from "./order.interface";

const OrderSchema = new Schema<TOrder>(
  {
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      status: {
        type: String,
        required: true,
        enum: Object.keys(orderStatus),
        default: orderStatus.Pending,
      },
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model<TOrder>("Order", OrderSchema);
