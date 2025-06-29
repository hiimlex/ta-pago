import { BaseController } from "@core/base_controller";
import { Endpoints } from "@types";
import { CrewsRepositoryImpl } from "./crews.repository";
import { AuthRepositoryImpl } from "../auth";

export class CrewsController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(
			Endpoints.CrewsCreate,
			(req, res, next) => {
				AuthRepositoryImpl.is_authenticated(req, res, next);
			},
			(req, res) => {
				CrewsRepositoryImpl.create(req, res);
			}
		);

		this.router.get(
			Endpoints.CrewsGet,
			(req, res, next) => {
				AuthRepositoryImpl.is_authenticated(req, res, next);
			},
			(req, res) => {
				CrewsRepositoryImpl.get_by_code(req, res);
			}
		);
	}
}
