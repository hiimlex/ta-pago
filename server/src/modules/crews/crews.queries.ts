import { composeWithMongoose } from "graphql-compose-mongoose";
import { CrewsModel } from "./crews.schema";
import { UsersTC } from "../users";
import { ICrewDocument } from "types/collections";

const CrewsTC = composeWithMongoose(CrewsModel);

CrewsTC.addRelation("admins", {
	resolver: () => UsersTC.getResolver("findMany"),
	prepareArgs: {
		filter: (source: ICrewDocument) => ({
			_id: { $in: source.admins.map((id) => id.toString()) },
		}),
	},
	projection: { admins: true },
});

CrewsTC.addRelation("members", {
	resolver: () => UsersTC.getResolver("findMany"),
	prepareArgs: {
		filter: (source: ICrewDocument) => ({
			_id: { $in: source.members.map((id) => id.toString()) },
		}),
	},
	projection: { members: true },
});

CrewsTC.addRelation("white_list", {
	resolver: () => UsersTC.getResolver("findMany"),
	prepareArgs: {
		filter: (source: ICrewDocument) => ({
			_id: { $in: (source.white_list || []).map((id) => id.toString) },
		}),
	},
	projection: { white_list: true },
});

const CrewGPQLQueries = {
	crews: CrewsTC.getResolver("findMany"),
	crewById: CrewsTC.getResolver("findById"),
	crewOne: CrewsTC.getResolver("findOne"),
};
const CrewGPQLMutations = {};

export { CrewGPQLQueries, CrewGPQLMutations, CrewsTC };
