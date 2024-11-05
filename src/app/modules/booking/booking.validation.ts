import { z } from "zod";

const createBookingSchema = z.object({
  body: z.object({
    carId: z.string().min(1, { message: "Car ID is required" }),
    startDate: z.string({
      message:
        'Invalid date format, expected "YYYY-MM-DD" date format e.g:"2020-01-01"',
    }),
    startTime: z.string().refine(
      (time) => {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
      },
      {
        message: 'Invalid time format , expected "HH:MM" in 24 hours format',
      }
    ),
    expectedEndDate: z.string({
      message:
        'Invalid date format, expected "YYYY-MM-DD" date format e.g:"2020-01-01"',
    }),
    expectedEndTime: z.string().refine(
      (time) => {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
      },
      {
        message: 'Invalid time format , expected "HH:MM" in 24 hours format',
      }
    ),
    additionalFeatures: z.array(z.string()).default([]),
    additionalInsurance: z.array(z.string()).default([]),
    nidOrPassport: z.string().min(10, "Nid/Passport is required").trim(),
    drivingLicense: z.string().min(16, "Driving License is required").trim(),
  }),
});

const returnCarSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    endDate: z.string({
      message:
        'Invalid date format, expected "YYYY-MM-DD" date format e.g:"2020-01-01"',
    }),
    endTime: z.string().refine(
      (time) => {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
      },
      {
        message: 'Invalid time format , expected "HH:MM" in 24 hours format',
      }
    ),
  }),
});

const approveBookingSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1, { message: "Booking ID is required" }),
  }),
});

export const BookingValidation = {
  createBookingSchema,
  returnCarSchema,
  approveBookingSchema,
};
