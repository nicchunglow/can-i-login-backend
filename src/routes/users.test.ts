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

describe("Events", () => {
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
        username: "totoro",
        userId: "1",
        password: "chocoPie123",
        firstName: "Nic",
        lastName: "Chung",
        stageName: "Jay Chou",
      },
      {
        username: "monopolo",
        userId: "2",
        password: "chocoPie123",
        firstName: "Pororo",
        lastName: "Chung",
        stageName: "Ah Du",
      },
    ];
    await userModel.create(userData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await userModel.deleteMany();
  });

  describe("/users/register", () => {
    it("POST should add one user with password of one lowercase, one uppercase and numbers", async () => {
      const expectedUserData = {
        username: "mrliew",
        userId: "3",
        password: "chocoPie123",
        firstName: "De",
        lastName: "Hua",
      };
      const { body: users } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(201);
      expect(users.username).toBe(expectedUserData.username);
      expect(users.password).not.toBe("chocoPie123");
    });
    it("POST should fail with password of no uppercase and numbers", async () => {
      const expectedUserData = {
        username: "mrliew",
        userId: "3",
        password: "chocopie123",
        firstName: "De",
        lastName: "Hua",
      };
      const { body: error } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(400);
      expect(error.error).toEqual(
        expect.stringContaining("createUsers validation failed")
      );
    });
    it("POST should not add user if username is uppercase", async () => {
      const expectedUserData = {
        username: "Tororo12",
        userId: "3",
        password: "chocoPie123",
        firstName: "De",
        lastName: "Hua",
      };
      const { body: error } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(400);
      expect(error.error).toEqual(
        expect.stringContaining("createUsers validation failed")
      );
    });
  });
});
