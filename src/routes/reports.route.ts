import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middleware/auth");

const getReports = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ message: "YOU ARE LOGINED TO GET YOUR REPORTS!" });
};

const userErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  next(err);
};
router.get("/", protectRoute, getReports);
router.use(userErrorHandler);

module.exports = router;
