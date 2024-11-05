import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const isPasswordMatch = async (
  requestPassword: string,
  hashedPassword: string
) => {
  const isMatched = await bcrypt.compare(requestPassword, hashedPassword);

  return isMatched;
};

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};
