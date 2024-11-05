import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TCategory } from "./itemCategory.interface";
import { ItemCategory } from "./itemCategory.model";

const createCategory = async (categoryData: TCategory) => {
  const category = await ItemCategory.create(categoryData);
  return category;
};

const getAllCategories = async () => {
  const categories = await ItemCategory.find({ isDeleted: false });

  return categories;
};

const getCategoryById = async (categoryId: string) => {
  const category = await ItemCategory.findOne({
    _id: categoryId,
    isDeleted: false,
  });

  if (!category)
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  return category;
};

const updateCategory = async (id: string, updateData: Partial<TCategory>) => {
  const category = await ItemCategory.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { new: true }
  );

  if (!category)
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  return category;
};

const deleteCategory = async (id: string) => {
  const category = await ItemCategory.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!category)
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  return category;
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
