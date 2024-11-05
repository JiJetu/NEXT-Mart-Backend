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

  const userExits = await User.findOne({ email: user?.email });

  if (!userExits) {
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
    .update(userExits.email + Date.now().toString())
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
  const result = await Order.find().populate("product");

  return result;
};

const getMyOrders = async (user: JwtPayload) => {
  const userExits = await User.findOne({ email: user?.email });

  if (!userExits) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }

  return await Order.find({ user.email: userExists._id }).populate("product");
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getMyOrders,
};
