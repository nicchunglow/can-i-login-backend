export {};
const request = require("supertest");
const app = require("./app");
const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("/", () => {
	it("should contain the home directory", async () => {
		const expectedDirectory = {
			0: "GET   /",
			"1": "POST /users/register",
			"2": "POST /users/login",
			"3": "GET /reports",
			"4": "GET /auth",
		};
		const { body: response } = await request(app).get("/");
		expect(response).toEqual(expectedDirectory);
	});
});
