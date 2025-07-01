import winston from "winston";
import { MongoDB, MongoDBConnectionOptions } from "winston-mongodb";

const timezoneDate = () => {
	return new Date().toLocaleString("pt-BR", {
		timeZone: "America/Sao_Paulo",
	});
};

const sensitiveFields = ["password", "access_token"];

export const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp({ format: timezoneDate }),
		winston.format.json({
			replacer(key, value) {
				if (sensitiveFields.includes(key)) {
					return undefined;
				}
				return value;
			},
		}),
		winston.format.colorize({ all: true })
	),
	transports: [new winston.transports.Console()],
	exitOnError: false,
});

export function add_mongo_transport() {
	const transportOptions: MongoDBConnectionOptions = {
		db: process.env.DB_URL || "",
		level: "error",
		collection: "Logs",
		capped: true,
		cappedMax: 1000,
		format: winston.format.json({
			replacer(key, value) {
				if (sensitiveFields.includes(key)) {
					return undefined;
				}
				return value;
			},
		}),
	};

	logger.add(new MongoDB(transportOptions));
}
