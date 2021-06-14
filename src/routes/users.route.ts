import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
const express = require("express");
const router = express.Router();
const usersModel = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const createJWTToken = (
  username: string,
  userId: string,
  firstName: string,
  lastName: string
) => {
  const payload = {
    username: username,
    userId: userId,
    firstName: firstName,
    lastName: lastName,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  return token;
};

const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = oneDay * 7;

const expiryDate = new Date(Date.now() + oneWeek);

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

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const user = await usersModel.findOne({ username });
      if (!user) {
        throw new Error("Login failed");
      }
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        throw new Error("Login failed");
      }

      const token = createJWTToken(
        user.username,
        user.userId,
        user.firstName,
        user.lastName
      );

      res.cookie("token", token, {
        expires: expiryDate,
        httpOnly: true,
      });

      res.status(201).json("You are now logged in!");
    } catch (err) {
      if (err.message === "Login failed") {
        err.statusCode = 400;
      }
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