import dotenv from "dotenv";
import path from "path";

// dotenv.config();
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  salt_round: process.env.SALT_ROUND,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  store_id: process.env.STORE_ID,
  signature_key: process.env.SIGNATURE_KEY,
  payment_url: process.env.PAYMENT_URL,
  payment_verify_url: process.env.PAYMENT_VERIFY_URL,
  payment_backend_url: process.env.PAYMENT_BACKEND_URL,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
};
