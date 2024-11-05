import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CarRoutes } from "../modules/Car/car.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { UserRoutes } from "../modules/User/user.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { ReviewRoutes } from "../modules/review/review.route";

const router = Router();

const moduleRoute = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/cars",
    route: CarRoutes,
  },
  {
    path: "/bookings",
    route: BookingRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
