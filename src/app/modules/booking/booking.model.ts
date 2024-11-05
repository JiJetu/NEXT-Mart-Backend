import { Schema, model } from "mongoose";
import { TBooking } from "./booking.interface";

const bookingSchema = new Schema<TBooking>(
  {
    startDate: {
      type: String,
      required: true,
    },
    expectedEndDate: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    additionalFeatures: {
      type: [String],
      default: [],
    },
    additionalInsurance: {
      type: [String],
      default: [],
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      default: null,
    },
    endTime: {
      type: String,
      default: null,
    },
    expectedEndTime: {
      type: String,
      required: true,
    },
    bookingConfirm: {
      type: Boolean,
      default: false,
    },
    reviewStatus: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    canceledBooking: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = model<TBooking>("Booking", bookingSchema);
