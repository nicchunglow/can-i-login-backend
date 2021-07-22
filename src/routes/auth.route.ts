import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const getCookieInfo = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cookieInfo = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
		res.status(200).send(cookieInfo);
	} catch (err) {
		next(err);
	}
};

const userErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	next(err);
};
router.get("/", protectRoute, getCookieInfo);
router.use(userErrorHandler);

module.exports = router;
