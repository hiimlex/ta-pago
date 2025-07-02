import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { ApiPrefix, Endpoints } from "types/generics";
import { create_user_mock } from "../../__mocks__";
import { Server } from "../../app";
import supertest from "supertest";

const test_server = new Server();
test_server.setup();
const test_agent = supertest(test_server.app);

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
	await test_server.stop();
});

describe("Auth module", () => {
	const mock_user = create_user_mock();

	describe(`POST ${Endpoints.AuthSignUp}`, () => {
		it("should create an user", async () => {
			const { body: c_user, statusCode } = await test_agent
				.post(ApiPrefix + Endpoints.AuthSignUp)
				.send(mock_user);

			expect(statusCode).toBe(201);
			expect(c_user).toHaveProperty("email");
			expect(c_user).toHaveProperty("name");
			expect(c_user).toHaveProperty("_id");
			expect(c_user).not.toHaveProperty("password");
		});
	});

	describe(`POST ${Endpoints.AuthLogin}`, () => {
		it("should login an user", async () => {
			const { statusCode, headers } = await test_agent
				.post(ApiPrefix + Endpoints.AuthLogin)
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
	});

	describe(`GET ${Endpoints.AuthMe}`, () => {
		it("should get an user by access cookie", async () => {
			const response = await test_agent
				.get(ApiPrefix + Endpoints.AuthMe)
				.set("Cookie", cookie);

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveProperty("email");
			expect(response.body.email).toBe(mock_user.email);
		});
	});
});
