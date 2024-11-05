import { Request, Response } from "express";
import { paymentServices } from "./payment.service";

const paymentConfirmation = async (req: Request, res: Response) => {
  const { transactionId, status } = req.query;

  const result = await paymentServices.confirmationService(
    transactionId as string,
    status as string
  );
  res.send(result);

  //   sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: "Payment conformation successful",
  //     data: result,
  //   });
};

export const paymentController = {
  paymentConfirmation,
};
