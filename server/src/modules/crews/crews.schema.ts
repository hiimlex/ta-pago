import { timestamps } from "@core/config";
import {
	Collections,
	CrewStrikes,
	CrewVisibility,
	ICrewDocument,
	ICrewsModel,
} from "@types";
import { model, Schema, Types } from "mongoose";

const CrewRulesSchema = new Schema(
	{
		gym_focused: { type: Boolean, default: false },
		paid_at_anytime: { type: Boolean, default: true },
		paid_without_picture: { type: Boolean, default: true },
		show_members_rank: { type: Boolean, default: true },
		free_weekends: { type: Boolean, default: true },
	},
	{ versionKey: false, _id: false }
);

const CrewsSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		code: {
			type: String,
			required: true,
			unique: true,
		},
		admin_id: {
			type: Schema.Types.ObjectId,
			ref: Collections.Users,
		},
		members: {
			type: [Types.ObjectId],
			ref: Collections.Users,
			required: false,
		},
		white_list: {
			type: [Types.ObjectId],
			ref: Collections.Users,
			required: false,
		},
		visibility: {
			type: String,
			enum: Object.values(CrewVisibility),
			default: CrewVisibility.Public,
		},
		banner: {
			type: String,
			required: false,
		},
		rules: { type: CrewRulesSchema, required: false },
		strikes: {
			type: [String],
			enum: Object.values(CrewStrikes),
			default: [CrewStrikes.Daily, CrewStrikes.Weekly],
		},
		lose_strike_in_days: {
			type: Number,
			default: 2,
			required: false,
		},
	},
	{ versionKey: false, timestamps }
);

CrewsSchema.methods.populate_members = async function () {
	await this.populate({
		path: "members",
		select: "name email avatar coins",
	});
};

const CrewsModel: ICrewsModel = model<ICrewDocument, ICrewsModel>(
	Collections.Crews,
	CrewsSchema
);

export { CrewsSchema, CrewRulesSchema, CrewsModel };
