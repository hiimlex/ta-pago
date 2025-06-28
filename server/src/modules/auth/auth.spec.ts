import mongoose from "mongoose";
import { test_agent } from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { create_user_mock } from "../../__mocks__";
import { Endpoints } from "@types";

const test_server = test_agent;
let mongo_server: MongoMemoryServer;

beforeAll(async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}

	mongo_server = await MongoMemoryServer.create();
	const uri = mongo_server.getUri();
	await mongoose.connect(uri);
});

afterAll(async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany({});
	}

	await mongoose.disconnect();
	await mongo_server.stop();
});

describe("Auth module", () => {
	const mock_user = create_user_mock();

	it("should sign up an user", async () => {
		const { body: c_user, statusCode } = await test_server
			.post(Endpoints.AuthSignUp)
			.send(mock_user);

		expect(statusCode).toBe(201);
		expect(c_user).toHaveProperty("email");
		expect(c_user).toHaveProperty("name");
		expect(c_user).toHaveProperty("_id");
		expect(c_user).not.toHaveProperty("password");
	});

	it("should login with an user", async () => {
		const { body: login_data, statusCode } = await test_server
			.post(Endpoints.AuthLogin)
			.send({
				email: mock_user.email,
				password: mock_user.password,
			});

		expect(statusCode).toBe(200);
		expect(login_data).toHaveProperty("access_token");
	});
});
