import { UsersSchema } from "@modules/users";
import { Document, InferSchemaType, Model, Types } from "mongoose";

export type TUser = InferSchemaType<typeof UsersSchema>;

export interface IUserDocument extends Document<Types.ObjectId>, TUser {}

export interface IUsersModel extends Model<IUserDocument> {}
