import { Types } from "mongoose";

export type TBooking = {
  startDate: string;
  expectedEndDate: string;
  user: Types.ObjectId;
  car: Types.ObjectId;
  startTime: string;
  endDate: string;
  endTime: string;
  expectedEndTime: string;
  additionalFeatures: string[];
  additionalInsurance: string[];
  transactionId: string;
  bookingConfirm?: boolean;
  reviewStatus?: boolean;
  canceledBooking?: boolean;
  paymentStatus?: boolean;
  totalCost: number;
  createdAt?: Date;
  updatedAt?: Date;
};
