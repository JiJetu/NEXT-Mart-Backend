import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.service";

const createProduct = catchAsync(async (req, res) => {
  const product = await ProductServices.createProduct(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product created successfully",
    data: product,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const products = await ProductServices.getAllProducts(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products retrieved successfully",
    data: products,
  });
});

const getProductById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await ProductServices.getProductById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product retrieved successfully",
    data: product,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await ProductServices.updateProduct(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product updated successfully",
    data: product,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await ProductServices.deleteProduct(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product deleted successfully",
    data: product,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
