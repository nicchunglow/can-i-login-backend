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

describe("Users", () => {
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
        password: "Password123",
        firstName: "Nic",
        lastName: "Chung",
      },
      {
        username: "monopolo",
        userId: "2",
        password: "Password123",
        firstName: "Pororo",
        lastName: "Chung",
      },
    ];
    await userModel.create(userData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await userModel.deleteMany();
  });

  describe("/users/register", () => {
    it("POST should add a user with username, userId, password, firstName and lastName", async () => {
      const expectedUserData = {
        username: "mrliew",
        userId: "3",
        password: "Password123",
        firstName: "Nic",
        lastName: "Last",
      };
      const { body: users } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(201);
      expect(users.username).toBe(expectedUserData.username);
      expect(users.firstName).toBe(expectedUserData.firstName);
      expect(users.lastName).toBe(expectedUserData.lastName);
      expect(users.userId).not.toBe(expectedUserData.userId);
      expect(users.password).not.toBe(expectedUserData.password);
    });
    it("POST should fail with password of no uppercase and numbers", async () => {
      const expectedUserData = {
        username: "mrliew",
        userId: "3",
        password: "password123",
        firstName: "Nic",
        lastName: "Last",
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
        password: "Password123",
        firstName: "Nic",
        lastName: "Last",
      };
      const { body: error } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(400);
      expect(error.error).toEqual(
        expect.stringContaining("createUsers validation failed")
      );
    });
    it("POST should not add user if there is no username", async () => {
      const expectedUserData = {
        userId: "3",
        password: "Password123",
        firstName: "Nic",
        lastName: "Last",
      };
      const { body: error } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(400);
      expect(error.error).toEqual(
        expect.stringContaining("createUsers validation failed")
      );
    });
    it("POST should not add user there is no password", async () => {
      const expectedUserData = {
        username: "tororo12",
        userId: "3",
        firstName: "Nic",
        lastName: "Last",
      };
      const { body: error } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(400);
      expect(error.error).toEqual(
        expect.stringContaining("createUsers validation failed")
      );
    });
    describe("/users/login", () => {
      it("POST user should be able to login", async () => {
        const expectedUserData = {
          username: "totoro",
          password: "Password123",
        };
        const { body: users } = await request(app)
          .post("/users/login")
          .send(expectedUserData)
          .expect(201);
        expect(users).toBe("You are now logged in!");
      });
      it("POST user should not login if password is wrong", async () => {
        const expectedUserData = {
          username: "totoro",
          password: "chocoie123",
        };
        const { body: error } = await request(app)
          .post("/users/login")
          .send(expectedUserData)
          .expect(400);
        expect(error.error).toEqual("Login failed");
      });
      it("POST user should not login if username is wrong", async () => {
        const expectedUserData = {
          username: "tooo",
          password: "Password123",
        };
        const { body: error } = await request(app)
          .post("/users/login")
          .send(expectedUserData)
          .expect(400);
        expect(error.error).toEqual("Login failed");
      });
    });
  });
});
