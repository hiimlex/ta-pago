import { AuthController, CrewsController } from "../modules";

const auth_controller = new AuthController();
const crews_controller = new CrewsController();

export const routers = [auth_controller.router, crews_controller.router];
