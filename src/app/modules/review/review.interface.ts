import { Types } from "mongoose";

export type TReview = {
  user: Types.ObjectId;
  product: Types.ObjectId;
  userReview: string;
  createdAt?: Date;
  updatedAt?: Date;
};
