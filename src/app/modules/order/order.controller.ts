import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  const order = await OrderService.createOrder(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order created successfully",
    data: order,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const orders = await OrderService.getAllOrders();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully",
    data: orders,
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  const user = req.user;

  const orders = await OrderService.getMyOrders(user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully",
    data: orders,
  });
});

const singleOrderInfo = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const orders = await OrderService.singleOrderInfo(orderId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully",
    data: orders,
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrders,
  getMyOrders,
  singleOrderInfo,
};
