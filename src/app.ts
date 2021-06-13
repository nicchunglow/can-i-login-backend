import type { ErrorRequestHandler, Request, Response } from "express";
require("dotenv");
const express = require("express");
const cors = require("cors");

const app = express();

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  if (err.status) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
};

const appIndex = (req: Request, res: Response) => {
  res.send({
    0: "GET   /",
  });
};

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:3001",
  ],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", appIndex);

app.use(errorHandler);

module.exports = app;
