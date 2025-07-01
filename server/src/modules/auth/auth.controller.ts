import { BaseController } from "@core/base_controller";
import { Endpoints } from "types/generics";
import { AuthRepositoryImpl } from "./auth.repository";

export class AuthController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(Endpoints.AuthSignUp, AuthRepositoryImpl.sign_up);

		this.router.post(Endpoints.AuthLogin, AuthRepositoryImpl.login);

		this.router.get(
			Endpoints.AuthMe,
			AuthRepositoryImpl.is_authenticated,
			AuthRepositoryImpl.me
		);
	}
}
