import { timestamps } from "@core/config";
import { Collections, IUserDocument, IUsersModel } from "@types";
import { model, Schema } from "mongoose";

const UserSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		access_token: { type: String, required: false },
	},
	{ versionKey: false, timestamps, collection: Collections.Users }
);

UserSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	// Remove the password field from the user object
	delete userObject.password;

	return userObject;
};

const UsersModel: IUsersModel = model<IUserDocument, IUsersModel>(
	Collections.Users,
	UserSchema,
	Collections.Users
);

export { UserSchema, UsersModel };
