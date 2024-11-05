import axios from "axios";
import config from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

type TPaymentInfoProps = {
  transactionId: string;
  totalCost: number;
  userName: string;
  userEmail: string;
  userAddress: string;
  userPhone: string;
};

export const initiatePayment = async (paymentInfo: TPaymentInfoProps) => {
  try {
    const response = await axios.post(config.payment_url!, {
      store_id: config.store_id,
      signature_key: config.signature_key,
      tran_id: paymentInfo.transactionId,
      success_url: `${config.payment_backend_url}/api/payments/conformation?transactionId=${paymentInfo.transactionId}&status=success`,
      fail_url: `${config.payment_backend_url}/api/payments/conformation?status=faild`,
      cancel_url:
        "https://car-rental-reservation-system-client-six.vercel.app/user/booking-history",

      // cancel_url: "http://localhost:5173/user/booking-history",
      amount: paymentInfo.totalCost,
      currency: "BDT",
      desc: "Merchant Registration Payment",
      cus_name: paymentInfo.userName,
      cus_email: paymentInfo.userEmail,
      cus_add1: paymentInfo.userAddress,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "N/A",
      cus_phone: paymentInfo.userPhone,
      type: "json",
    });

    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "something went wrong!");
  }
};

export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(config.payment_verify_url!, {
      params: {
        store_id: config.store_id,
        signature_key: config.signature_key,
        type: "json",
        request_id: tnxId,
      },
    });

    return response.data;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "something went wrong!");
  }
};
