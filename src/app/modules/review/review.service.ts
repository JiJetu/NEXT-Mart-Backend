import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { TReview } from "./review.interface";
import AppError from "../../errors/AppError";
import { User } from "../User/user.model";
import { Review } from "./review.model";
import { Product } from "../product/product.model";

const createReviewIntoDB = async (
  productId: string,
  payload: Partial<TReview>,
  user: JwtPayload
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // check user is exists
  const userExists = await User.findOne({ email: user?.email });

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!!");
  }

  const result = (
    await (await Review.create(payload)).populate("user")
  ).populate("product");

  return result;
};

const getAllReviewFromDB = async () => {
  const result = await Review.find().populate("user").populate("product");

  return result;
};

const getSpecificReviewFromDB = async (productId: string) => {
  const productExists = await Product.findById(productId);

  if (!productExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const result = await Review.find({ product: productExists._id })
    .populate("user")
    .populate("product");

  return result;
};

export const ReviewService = {
  createReviewIntoDB,
  getAllReviewFromDB,
  getSpecificReviewFromDB,
};
