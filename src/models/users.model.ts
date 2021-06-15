export {};
import { NextFunction } from "express";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const { emailValidator, passwordValidator } = require("../utils/validators");

const checkEmail = function (email: string) {
  //To check email string and still allow if there are capital letters
  return emailValidator(email);
};
const checkPassword = function (password: string) {
  return passwordValidator(password);
};
const userSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: checkEmail,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: checkPassword,
    },
  },
  firstName: String,
  lastName: String,
  stageName: String,
});

userSchema.pre("save", async function (next: NextFunction) {
  const rounds = 10;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

const userCreatorModel = mongoose.model("createUsers", userSchema);

module.exports = userCreatorModel;
