import express from "express";
import { paymentController } from "./payment.controller";

const router = express.Router();

router.post("/conformation", paymentController.paymentConfirmation);

export const PaymentRoutes = router;
