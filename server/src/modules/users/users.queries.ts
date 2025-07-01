import { composeWithMongoose } from "graphql-compose-mongoose";
import { UsersModel } from "./users.schema";

const UsersTC = composeWithMongoose(UsersModel);

UsersTC.removeField(["access_token", "password"]);

const UserGPQLQueries = {
	userById: UsersTC.getResolver("findById"),
	userOne: UsersTC.getResolver("findOne"),
	users: UsersTC.getResolver("findMany"),
};

const UserGPQLMutations = {};

export { UserGPQLQueries, UserGPQLMutations, UsersTC };