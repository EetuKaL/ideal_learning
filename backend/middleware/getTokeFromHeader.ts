import { NextFunction, Request, Response } from "express";
//create. getTokenFromHeader.js  file
const getTokenFromHeader = (req: Request) => {
  if (!req.headers.authorization) {
    return {
      status: "Failed",
      message: "Authorization header not found",
    };
  }
  const token = req.headers.authorization.split(" ")[1];
  return token;
};

export default getTokenFromHeader;
