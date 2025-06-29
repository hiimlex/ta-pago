import { BaseController } from "@core/base_controller";
import { Endpoints } from "@types";
import { AuthRepositoryImpl } from "./auth.repository";

export class AuthController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(Endpoints.AuthSignUp, (req, res) => {
			AuthRepositoryImpl.sign_up(req, res);
		});

		this.router.post(Endpoints.AuthLogin, (req, res) => {
			AuthRepositoryImpl.login(req, res);
		});

		this.router.get(
			Endpoints.AuthMe,
			(req, res, next) => {
				AuthRepositoryImpl.is_authenticated(req, res, next);
			},
			(req, res) => {
				AuthRepositoryImpl.me(req, res);
			}
		);
	}
}
