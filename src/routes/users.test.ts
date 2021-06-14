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
        email: "totoro@gmail.com",
        password: "Password123",
        firstName: "Nic",
        lastName: "Chung",
      },
      {
        email: "monopolo@gmail.com",
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
    it("POST should add a user with email, password, firstName and lastName", async () => {
      const expectedUserData = {
        email: "correctemail@gmail.com",
        password: "Password123",
        firstName: "Nic",
        lastName: "Last",
      };
      const { body: users } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(201);
      expect(users.email).toBe(expectedUserData.email);
      expect(users.firstName).toBe(expectedUserData.firstName);
      expect(users.lastName).toBe(expectedUserData.lastName);
      expect(users.password).not.toBe(expectedUserData.password);
    });
    it("POST should fail with password of no uppercase and numbers", async () => {
      const expectedUserData = {
        email: "correctemail@gmail.com",
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
    it.only("POST should add user if email is uppercase but turned registered as lowercase", async () => {
      const expectedUserData = {
        email: "Correctemail@gmail.com",
        password: "Password123",
        firstName: "Nic",
        lastName: "Last",
      };
      const lowerCaseEmail = expectedUserData.email.toLowerCase();
      console.log(lowerCaseEmail);
      const { body: users } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(201);
      expect(users.email).toBe(lowerCaseEmail);
    });
    it("POST should not add user if there is no email", async () => {
      const expectedUserData = {
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
        email: "correctemail@gmail.com",
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
    it("POST should not add a user with the same email", async () => {
      const expectedUserData = {
        email: "totoro@gmail.com",
        password: "Password123",
        firstName: "Nic",
        lastName: "Last",
      };
      const { body: error } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(403);
      expect(error).toEqual({
        error: "User exist.Please chose another email",
      });
    });
    describe("/users/login", () => {
      it("POST user should be able to login", async () => {
        const expectedUserData = {
          email: "totoro@gmail.com",
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
          email: "totoro@gmail.com",
          password: "chocoie123",
        };
        const { body: error } = await request(app)
          .post("/users/login")
          .send(expectedUserData)
          .expect(400);
        expect(error.error).toEqual("Login failed");
      });
      it("POST user should not login if email is wrong", async () => {
        const expectedUserData = {
          email: "tooo@gmail.com",
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
