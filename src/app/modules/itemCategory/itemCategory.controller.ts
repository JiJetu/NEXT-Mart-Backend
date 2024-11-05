import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoryServices } from "./itemCategory.service";

const createCategory = catchAsync(async (req, res) => {
  const category = await CategoryServices.createCategory(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: category,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await CategoryServices.getAllCategories();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryServices.getCategoryById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category retrieved successfully",
    data: category,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryServices.updateCategory(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryServices.deleteCategory(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully",
    data: category,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
