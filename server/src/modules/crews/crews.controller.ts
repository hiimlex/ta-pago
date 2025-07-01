import { BaseController } from "@core/base_controller";
import { Endpoints } from "types/generics";
import { CrewsRepositoryImpl } from "./crews.repository";
import { AuthRepositoryImpl } from "../auth";

export class CrewsController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(
			Endpoints.CrewsCreate,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.create
		);

		this.router.get(
			Endpoints.CrewsGet,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.get_by_code
		);
	}
}
