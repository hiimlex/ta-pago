import { HttpException } from "@core/http_exception";
import { UsersModel } from "@modules/users";
import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { IUserDocument } from "types/collections";
import { CrewsModel } from "./crews.schema";

class CrewsRepository {
	async create(req: Request, res: Response) {
		try {
			const { user } = res.locals;

			const { name, visibility, code, banner, rules } = req.body;

			const crew = await CrewsModel.create({
				name,
				visibility,
				code,
				banner,
				rules,
				admins: [user._id],
				members: [user._id],
				white_list: [],
			});

			return res.status(201).json(crew);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async get_by_code(req: Request, res: Response) {
		try {
			const { code } = req.params;

			const crew = await CrewsModel.findOne({ code });

			if (!crew) {
				throw new HttpException(404, "CREW_NOT_FOUND");
			}

			return res.status(200).json(crew);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async join(req: Request, res: Response) {
		try {
			const { code } = req.body;
			const { user } = res.locals;

			const crew = await CrewsModel.findOne({ code });

			if (!crew) {
				throw new HttpException(404, "CREW_NOT_FOUND");
			}

			const is_member = crew.members.includes(user._id);

			if (is_member) {
				throw new HttpException(400, "ALREADY_MEMBER");
			}

			if (crew.visibility === "private") {
				const is_whitelisted =
					crew.white_list && crew.white_list.includes(user._id);

				if (is_whitelisted) {
					throw new HttpException(403, "ALREADY_IN_WHITELIST");
				}

				await crew.updateOne({
					$addToSet: { white_list: user._id },
				});

				return res.status(200).json({
					requested_whitelist: true,
				});
			}

			await crew.updateOne({
				$addToSet: { members: user._id },
			});

			return res.sendStatus(204);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async leave(req: Request, res: Response) {
		try {
			const { code } = req.body;
			const { user } = res.locals;

			const crew = await CrewsModel.findOne({ code });

			if (!crew) {
				throw new HttpException(404, "CREW_NOT_FOUND");
			}

			const is_member = crew.members.includes(user._id);

			if (!is_member) {
				throw new HttpException(400, "USER_NOT_A_MEMBER");
			}

			await crew.updateOne({
				$pull: { members: user._id },
			});

			return res.sendStatus(204);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async update_admin(req: Request, res: Response) {
		try {
			const { user_id, code, set_admin } = req.body;
			console.log(user_id);
			const admin: IUserDocument = res.locals.user;

			const user = await UsersModel.findById(user_id);
			if (!user) {
				throw new HttpException(404, "USER_NOT_FOUND");
			}

			const crew = await CrewsModel.findOne({
				code,
				admins: admin._id.toString(),
			});

			if (!crew) {
				throw new HttpException(404, "CREW_NOT_FOUND");
			}

			const user_in_crew = crew.members.some(
				(member) => member._id.toString() === user._id.toString()
			);

			if (!user_in_crew) {
				throw new HttpException(400, "USER_NOT_A_MEMBER");
			}

			if (set_admin) {
				await crew.updateOne({
					$addToSet: { admins: user._id },
				});
			} else {
				await crew.updateOne({
					$pull: { admins: user._id },
				});
			}

			const updatedCrew = await CrewsModel.findById({
				_id: crew._id,
			})

			return res.status(200).json(updatedCrew);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async accept_member(req: Request, res: Response) {
		try {
			const admin: IUserDocument = res.locals.user;
			const { user_id, code } = req.body;

			const user = await UsersModel.findById(user_id);

			if (!user) {
				throw new HttpException(404, "USER_NOT_FOUND");
			}

			const crew = await CrewsModel.findOne({
				code,
				admins: admin._id.toString(),
			});

			if (
				!crew?.admins.some((a) => a._id.toString() === admin._id.toString())
			) {
				throw new HttpException(403, "UNAUTHORIZED");
			}

			if (!crew) {
				throw new HttpException(404, "CREW_NOT_FOUND");
			}

			const user_in_white_list =
				crew.white_list &&
				crew.white_list.some(
					(member) => member._id.toString() === user._id.toString()
				);

			if (!user_in_white_list) {
				throw new HttpException(400, "USER_NOT_IN_WHITELIST");
			}

			await crew.updateOne({
				$pull: { white_list: user._id },
				$addToSet: { members: user._id },
			});

			return res.sendStatus(204);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async kick_member(req: Request, res: Response) {
		try {
			const { user_id, code } = req.body;
			const admin: IUserDocument = res.locals.user;

			const user = await UsersModel.findById(user_id);

			if (!user) {
				throw new HttpException(404, "USER_NOT_FOUND");
			}

			const crew = await CrewsModel.findOne({
				code,
				admins: admin._id.toString(),
			});

			if (!crew) {
				throw new HttpException(404, "CREW_NOT_FOUND");
			}

			if (
				!crew?.admins.some((a) => a._id.toString() === admin._id.toString())
			) {
				throw new HttpException(403, "UNAUTHORIZED");
			}

			const user_in_crew = crew.members.some(
				(member) => member._id.toString() === user._id.toString()
			);

			if (!user_in_crew) {
				throw new HttpException(400, "USER_NOT_A_MEMBER");
			}

			await crew.updateOne({
				$pull: { members: user_id },
			});

			return res.sendStatus(204);
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const CrewsRepositoryImpl = new CrewsRepository();

export { CrewsRepositoryImpl };
