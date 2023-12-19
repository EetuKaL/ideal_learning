import { NextFunction, Request, Response } from "express";

import getTokenFromHeader from "./getTokeFromHeader";
import verifyToken from "../verifyJTWToken";

interface CustomRequest extends Request {
  user?: any;
}

const isLogin = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = getTokenFromHeader(req);
  let decodedUser;
  if (typeof token === "string") {
    decodedUser = verifyToken(token, "secret-key");
  }

  if (!decodedUser) {
    return res.status(400).json({
      code: 400,
      message: "Invalid token or token expired",
      user: decodedUser,
    });
  }

  req.user = decodedUser;
  next();
};

export default isLogin;
