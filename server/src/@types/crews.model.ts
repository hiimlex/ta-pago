import { CrewsSchema } from "@modules";
import { InferSchemaType, Document, Model } from "mongoose";

export enum CrewVisibility {
	Public = "public",
	Private = "private",
}

export enum CrewStrikes {
	Daily = "daily",
	Weekly = "weekly",
	Monthly = "monthly",
}

export type TCrew = InferSchemaType<typeof CrewsSchema>;

export interface ICrewDocument extends Document, TCrew {
	populate_members: () => Promise<void>;
}

export interface ICrewsModel extends Model<ICrewDocument> {}
