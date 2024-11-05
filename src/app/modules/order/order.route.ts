// order.routes.ts
import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../User/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidations } from "./order.validation";
import { OrderControllers } from "./order.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.user),
  validateRequest(OrderValidations.createOrderValidationSchema),
  OrderControllers.createOrder
);

router.get("/", auth(UserRole.admin), OrderControllers.getAllOrders);

router.get("/my-order", auth(UserRole.user), OrderControllers.getMyOrders);

router.get("/:orderId", auth(UserRole.user), OrderControllers.singleOrderInfo);

export const OrderRoutes = router;
