import { BaseController } from "@core/base_controller";
import { Endpoints } from "@types";
import AuthRepository from "./auth.repository";

export class AuthController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(Endpoints.AuthSignUp, (req, res) => {
			AuthRepository.sign_up(req, res);
		});

		this.router.post(Endpoints.AuthLogin, (req, res) => {
			AuthRepository.login(req, res);
		});
	}
}
