import { json } from "body-parser";
import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { routers } from "./routers";
import cookieParser from "cookie-parser";
import { JwtSecret } from "@types";

export class Server {
	app!: Application;
	port!: number | string;
	prefix!: string;

	constructor(port: number | string) {
		this.app = express();
		this.port = port;
		this.prefix = process.env.API_PREFIX || "/api/v1";

		this.connect_mongo_db();
		this.set_middlewares();
		this.init_routes();
	}

	start(): void {
		this.app.listen(this.port, () => {
			console.log(`Server started at port ${this.port}`);
		});
	}

	private init_routes(): void {
		for (const router of routers) {
			this.app.use(this.prefix, router);
		}
	}

	private set_middlewares(): void {
		this.app.use(json());
		this.app.use(cors());
		this.app.use(cookieParser(JwtSecret.toString()));
	}

	private async connect_mongo_db(): Promise<void> {
		try {
			await mongoose.connect(process.env.DB_URL || "").then(() => {
				console.log("Connected to database");
			});
		} catch (error) {
			console.error("Error connecting to database: ", error);
		}
	}
}
