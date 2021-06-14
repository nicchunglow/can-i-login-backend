import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
const express = require("express");
const router = express.Router();
const usersModel = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = new usersModel(req.body);
      await usersModel.init();
      user.userId = uuidv4();
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (err) {
      next(err);
    }
  }
);

const userErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
};
router.use(userErrorHandler);

module.exports = router;
