import { create_user_mock } from "__mocks__";
import TestAgent from "supertest/lib/agent";
import { IUserDocument } from "types/collections";
import { ApiPrefix, Endpoints } from "types/generics";

export const test_get_user_and_cookie = async (
	test_agent: TestAgent
): Promise<{
	cookie: string;
	user: IUserDocument;
}> => {
	const mock_user = create_user_mock();

	const created_user = (
		await test_agent.post(ApiPrefix + Endpoints.AuthSignUp).send(mock_user)
	).body;

	const { headers } = await test_agent
		.post(ApiPrefix + Endpoints.AuthLogin)
		.send({
			email: mock_user.email,
			password: mock_user.password,
		});

	const cookies = headers["set-cookie"];
	const cookie = cookies[0];

	return {
		cookie,
		user: created_user,
	};
};
