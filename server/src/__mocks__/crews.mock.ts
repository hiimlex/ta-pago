import { faker } from "@faker-js/faker";
import { CrewStrikes, CrewVisibility, TCrew } from "@types";

export const create_crew_mock = (crew: Partial<TCrew>): TCrew => ({
	name: faker.company.name(),
	code: faker.string.alphanumeric(6).toUpperCase(),
	visibility: CrewVisibility.Public,
	banner: faker.image.url(),
	rules: {
		gym_focused: false,
		paid_at_anytime: true,
		paid_without_picture: true,
		show_members_rank: true,
		free_weekends: true,
	},
	strikes: [CrewStrikes.Daily],
	...crew,
});
