import { AuthController } from "@modules";

const auth_controller = new AuthController();
export const routers = [auth_controller.router];
