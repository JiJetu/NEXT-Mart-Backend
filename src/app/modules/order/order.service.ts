import crypto from "crypto";
import { Product } from "../product/product.model";
import { TOrder } from "./order.interface";
import { Order } from "./order.model";
import { User } from "../User/user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { orderStatus } from "./order.constant";
import { initiatePayment } from "../payment/payment.utils";
import { JwtPayload } from "jsonwebtoken";

const createOrder = async (orderData: Partial<TOrder>) => {
  const { user, products } = orderData;

  const userExists = await User.findOne({ email: user?.email });

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }

  let totalPrice = 0;

  // calculate the total price
  const productDetails = await Promise.all(
    products!.map(async (item: any) => {
      const product = await Product.findById(item.product);
      if (product) {
        totalPrice += product.price * item.quantity;
        return {
          product: product._id,
          quantity: item.quantity,
        };
      } else {
        throw new Error("Product not found");
      }
    })
  );

  const hash = crypto
    .createHash("sha256")
    .update(userExists.email + Date.now().toString())
    .digest("hex")
    .slice(0, 10);

  const transactionId = `TXN-${hash}`;

  const order = new Order({
    user,
    products: productDetails,
    totalPrice,
    orderStatus: orderStatus.Pending,
    paymentStatus: false,
    transactionId,
  });

  await order.save();

  const paymentData = {
    transactionId,
    totalPrice,
    customerName: user!.name,
    customerEmail: user!.email,
    customerPhone: user!.phone,
    customerAddress: user!.address,
  };

  //payment
  const paymentSession = await initiatePayment(paymentData);

  console.log(paymentSession);

  return paymentSession;
};

const getAllOrders = async () => {
  const result = await Order.find().populate("products.product");

  return result;
};

const getMyOrders = async (userInfo: JwtPayload) => {
  const userExists = await User.findOne({ email: userInfo?.email });

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }

  return await Order.find({ "user.email": userExists.email }).populate(
    "products.product"
  );
};

const singleOrderInfo = async (orderId: string) => {
  const order = await Order.findById(orderId).populate("products.product");

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  return order;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getMyOrders,
  singleOrderInfo,
};
