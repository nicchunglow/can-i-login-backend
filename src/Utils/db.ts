require("dotenv").config();
const mongoose = require("mongoose");

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

const dbName = "CanILoginDB";
const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/" + dbName;

const connection = async () => {
  mongoose.connect(dbUrl, mongoOptions);
};

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log(`You have connected to ${dbName} server at ${dbUrl}`);
});

module.exports = connection;
