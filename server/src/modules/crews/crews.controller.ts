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
			Endpoints.CrewsGetByCode,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.get_by_code
		);

		this.router.post(
			Endpoints.CrewsJoin,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.join
		);

		this.router.post(
			Endpoints.CrewsLeave,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.leave
		);

		this.router.put(
			Endpoints.CrewsUpdateAdmin,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.update_admin
		);

		this.router.post(
			Endpoints.CrewsAcceptMember,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.accept_member
		);

		this.router.post(
			Endpoints.CrewsKickMember,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.kick_member
		);
	}
}
