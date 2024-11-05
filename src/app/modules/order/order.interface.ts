import { Types } from "mongoose";
import { orderStatus } from "./order.constant";

export type TOrder = {
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  products: {
    product: Types.ObjectId;
    quantity: number;
  }[];
  totalAmount: number;
  orderStatus: keyof typeof orderStatus;
  createdAt?: Date;
  updatedAt?: Date;
  transactionId: string;
  paymentStatus?: boolean;
};
