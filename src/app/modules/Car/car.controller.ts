import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CarService } from "./car.service";

const createCar = catchAsync(async (req, res) => {
  const result = await CarService.createCarIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Car created successfully",
    data: result,
  });
});

const getAllCar = catchAsync(async (req, res) => {
  const result = await CarService.getAllCarFromDB(req.query);

  if (Object.keys(result).length <= 0) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      meta: result.meta,
      data: result.result,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cars retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getSingleCar = catchAsync(async (req, res) => {
  const { carId } = req.params;

  const result = await CarService.getSingleCarFromDB(carId);

  if (result === null) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: [],
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "A Car retrieved successfully",
    data: result,
  });
});

const updateCar = catchAsync(async (req, res) => {
  const { carId } = req.params;
  const result = await CarService.updateCarIntoDB(carId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car updated successfully",
    data: result,
  });
});

const returnCar = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await CarService.returnCardIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car returned successfully",
    data: result,
  });
});

const deleteCar = catchAsync(async (req, res) => {
  const { carId } = req.params;
  const result = await CarService.deleteCarIntoDB(carId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car Deleted successfully",
    data: result,
  });
});

export const CarControllers = {
  createCar,
  getAllCar,
  getSingleCar,
  updateCar,
  deleteCar,
  returnCar,
};
