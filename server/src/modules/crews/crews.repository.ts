import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { CrewsModel } from "./crews.schema";
import { HttpException } from "@core/server";

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
				admin_id: user._id,
				members: [user._id],
				white_list: [],
			});

			await crew.populate_members();

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
}

const CrewsRepositoryImpl = new CrewsRepository();

export { CrewsRepositoryImpl };
