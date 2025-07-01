import { timestamps } from "@config/schema.config";
import { composeWithMongoose } from "graphql-compose-mongoose";
import { model, Schema } from "mongoose";
import { Collections, IUserDocument, IUsersModel } from "types/collections";

const UsersSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		access_token: { type: String, required: false },
		avatar: { type: String, required: false },
		coins: { type: Number, default: 0, required: false },
	},
	{ versionKey: false, timestamps, collection: Collections.Users }
);

UsersSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	// Remove the password field from the user object
	delete userObject.password;
	delete userObject.access_token;

	return userObject;
};

const UsersModel: IUsersModel = model<IUserDocument, IUsersModel>(
	Collections.Users,
	UsersSchema,
	Collections.Users
);

export { UsersModel, UsersSchema };
