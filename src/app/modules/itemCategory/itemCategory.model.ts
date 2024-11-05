import { Schema, model } from "mongoose";
import { TCategory } from "./itemCategory.interface";

const ItemCategorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ItemCategory = model<TCategory>(
  "ItemCategory",
  ItemCategorySchema
);
