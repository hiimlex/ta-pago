import { logger } from "@config/logger.config";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export function validate_schema(validator: Joi.ObjectSchema) {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = validator.validate(req.body);
		if (error) {
			logger.error("Validating request body", { body: req.body });
			return res.status(400).json({ message: error.details[0].message });
		}
		next();
	};
}
