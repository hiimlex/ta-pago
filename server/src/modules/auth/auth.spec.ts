import mongoose from "mongoose";
import { test_agent } from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { create_user_mock } from "../../__mocks__";
import { Endpoints } from "@types";
import { STATUS_CODES } from "http";

const test_server = test_agent;
let mongo_server: MongoMemoryServer;
let cookie: string;

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

	it("POST /auth/sign-up", async () => {
		const { body: c_user, statusCode } = await test_server
			.post(Endpoints.AuthSignUp)
			.send(mock_user);

		expect(statusCode).toBe(201);
		expect(c_user).toHaveProperty("email");
		expect(c_user).toHaveProperty("name");
		expect(c_user).toHaveProperty("_id");
		expect(c_user).not.toHaveProperty("password");
	});

	it("POST /auth/login", async () => {
		const { statusCode, headers } = await test_server
			.post(Endpoints.AuthLogin)
			.send({
				email: mock_user.email,
				password: mock_user.password,
			});

		expect(statusCode).toBe(204);

		const cookies = headers["set-cookie"];
		cookie = cookies[0];
		expect(cookies).toBeDefined();

		const authCookie = cookies.includes("access_token");
		expect(authCookie).toBeDefined();
	});

	it("GET /auth/me", async () => {
		const response = await test_server
			.get(Endpoints.AuthMe)
			.set("Cookie", cookie);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("email");
		expect(response.body.email).toBe(mock_user.email);
	});
});
