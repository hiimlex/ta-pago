import { TUser } from "@types";
import { faker } from "@faker-js/faker";

export const create_user_mock = (user?: Partial<TUser>): TUser => ({
	name: faker.person.fullName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
	access_token: undefined,
	...user,
});
