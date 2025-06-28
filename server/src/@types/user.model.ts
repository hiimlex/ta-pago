import { UserSchema } from "@modules";
import { Document, InferSchemaType, Model, Types } from "mongoose";

export type TUser = InferSchemaType<typeof UserSchema>;

export interface IUserDocument extends Document<Types.ObjectId>, TUser {}

export interface IUsersModel extends Model<IUserDocument> {}
