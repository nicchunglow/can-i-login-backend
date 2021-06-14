import { NextFunction } from "express";

export {};
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const checkEmail = function (email: string) {
  //To check email string and still allow if there are capital letters
  return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
    email
  );
};
const checkPassword = function (password: string) {
  if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password) === true
  ) {
    return true;
  } else {
    return false;
  }
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
