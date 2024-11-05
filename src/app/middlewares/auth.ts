import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import config from "../config";
import { TUserRole } from "../modules/User/user.interface";

const auth = (...requireRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];


    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // check if the token is valid
    jwt.verify(
      token,
      config.JWT_ACCESS_SECRET as string,
      function (err, decoded) {
        // err
        if (err) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "You are not authorized!"
          );
        }
        // decoded
        const role = (decoded as JwtPayload).role
        if(requireRoles && !requireRoles.includes(role)){
          throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
        }
        
        req.user = decoded as JwtPayload;
        next();
      }
    );
  });
};

export default auth;
