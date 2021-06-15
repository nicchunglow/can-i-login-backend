import { NextFunction, Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../models/request.model";

const jwt = require("jsonwebtoken");

const protectRoute = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies) {
      throw new Error("You are not authorized.");
    }
    req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

module.exports = { protectRoute };
