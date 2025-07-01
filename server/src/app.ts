import { connect_database } from "@config/connect_database";
import { JwtSecret } from "types/generics";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import { routers } from "./routers/routers";
import { create_apollo_server } from "./gpql/gpql";
import { expressMiddleware } from "@as-integrations/express4";

export class Server {
	app!: Application;
	port!: number | string;
	prefix!: string;

	constructor(port: number | string) {
		this.port = port;
		this.prefix = process.env.API_PREFIX || "/api/v1";
	}

	private init_routes() {
		for (const router of routers) {
			this.app.use(this.prefix, router);
		}
	}

	private set_middlewares() {
		this.app.use(json());
		this.app.use(cors());
		this.app.use(cookieParser(JwtSecret.toString()));
	}

	async start() {
		this.app = express();

		await connect_database();
		const apollo_server = await create_apollo_server();

		this.set_middlewares();
		this.init_routes();

		if (apollo_server) {
			this.app.use("/graphql", expressMiddleware(apollo_server));
		}

		this.app.listen(this.port, () => {
			console.log(`Server started at port ${this.port}`);
		});
	}
}
