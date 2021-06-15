export {};
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const userModel = require("../models/users.model");
const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("Reports", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getUri();
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error(err);
    }
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const userData = [
      {
        email: "totoro@gmail.com",
        password: "Password123",
        firstName: "Nic",
        lastName: "Chung",
      },
    ];
    await userModel.create(userData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await userModel.deleteMany();
  });

  describe("/", () => {
    it("GET should show success message if user has logined", async () => {
      jwt.verify.mockReturnValueOnce({ email: "totoro@gmail.com" });
      const expectedResult = {
        message: "YOU ARE LOGINED TO GET YOUR REPORTS!",
      };
      const { body: reports } = await request(app).get("/reports").expect(200);
      expect(reports).toEqual(expectedResult);
    });
  });
});
