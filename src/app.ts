import type { ErrorRequestHandler, Request, Response } from "express";
require("dotenv");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const usersRouter = require("../src/routes/users.route");
const reportsRouter = require("../src/routes/reports.route");
const authRouter = require("../src/routes/auth.route");
const cors = require("cors");

const appIndex = (req: Request, res: Response) => {
  res.send({
    0: "GET   /",
    "1": "POST /users/register",
    "2": "POST /users/login",
    "3": "GET /reports",
    "4": "GET /auth",
  });
};

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  allowedHeaders: "content-type",
  credentials: true,
};
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.get("/", appIndex);
app.use("/users", usersRouter);
app.use("/reports", reportsRouter);
app.use("/auth", authRouter);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
};

app.use(errorHandler);

module.exports = app;
