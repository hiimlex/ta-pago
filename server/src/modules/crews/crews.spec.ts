import mongoose from "mongoose";
import { test_agent } from "../..";
import { MongoMemoryServer } from "mongodb-memory-server";
import { create_crew_mock, create_user_mock } from "../../__mocks__";
import { ApiPrefix, Endpoints } from "types/generics";
import { IUserDocument, TUser } from "types/collections/users.model";
import { TCrew } from "types/collections";


const test_server = test_agent;
let mongo_server: MongoMemoryServer;
let cookie: string;
let mock_user: TUser;
let created_user: IUserDocument;
let mock_crew: Partial<TCrew>;

beforeAll(async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}

	mongo_server = await MongoMemoryServer.create();
	const uri = mongo_server.getUri();
	await mongoose.connect(uri);

	mock_user = create_user_mock();

	created_user = (
		await test_server.post(ApiPrefix + Endpoints.AuthSignUp).send(mock_user)
	).body;

	const { headers } = await test_server
		.post(ApiPrefix + Endpoints.AuthLogin)
		.send({
			email: mock_user.email,
			password: mock_user.password,
		});

	const cookies = headers["set-cookie"];
	cookie = cookies[0];

	mock_crew = create_crew_mock({
		admins: [created_user._id] as any,
	});
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

describe("Crews module", () => {
	it("POST /crews", async () => {
		const { statusCode, body } = await test_server
			.post(ApiPrefix + Endpoints.CrewsCreate)
			.set("Cookie", cookie)
			.send(mock_crew);

		expect(statusCode).toBe(201);
		expect(body).toHaveProperty("name", mock_crew.name);
		expect(body).toHaveProperty("code", mock_crew.code);
	});

	it("GET /crews/:code", async () => {
		const { statusCode, body } = await test_server
			.get(ApiPrefix + Endpoints.CrewsGet.replace(":code", mock_crew.code || ''))
			.set("Cookie", cookie);

		expect(statusCode).toBe(200);
		expect(body).toHaveProperty("name", mock_crew.name);
		expect(body).toHaveProperty("code", mock_crew.code);
		expect(body).toHaveProperty("admin_id", created_user._id.toString());
	});
});
