import type { ErrorRequestHandler, Request, Response } from "express";
require("dotenv");
const express = require("express");
const cors = require("cors");
const usersRouter = require("../src/routes/users.route");
const app = express();

const appIndex = (req: Request, res: Response) => {
  res.send({
    0: "GET   /",
    "1": "POST /users/register",
    "2": "POST /users/login",
  });
};

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  allowedHeaders: "content-type.cookie",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", appIndex);
app.use("/users", usersRouter);

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
