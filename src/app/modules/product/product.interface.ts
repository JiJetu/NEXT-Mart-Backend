import { Types } from "mongoose";

export type TProduct = {
  name: string;
  description: string;
  price: number;
  stockQuantity?: number;
  category: Types.ObjectId;
  images?: string[];
  isDeleted?: boolean;
};
