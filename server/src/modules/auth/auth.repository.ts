import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { UsersModel } from "../user";
import { compareSync, hashSync } from "bcrypt";
import { HashSalt, JwtExpiresIn, JwtSecret, SystemErrors } from "@types";
import { HttpException } from "@core/server";
import jwt, { sign } from "jsonwebtoken";

class AuthRepository {
	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;

			const user = await UsersModel.findOne({ email });

			if (!user) {
				throw new HttpException(404, SystemErrors.USER_NOT_FOUND);
			}

			const is_password_valid = compareSync(password, user.password);

			if (!is_password_valid) {
				throw new HttpException(400, SystemErrors.INVALID_CREDENTIALS);
			}

			const access_token = sign({ id: user._id.toString() }, JwtSecret, {
				expiresIn: JwtExpiresIn,
			});

			await user.updateOne({
				access_token: access_token.toString(),
			});

			return res.status(200).json({
				access_token,
			});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async sign_up(req: Request, res: Response) {
		try {
			const { email, password, name } = req.body;

			const hash_password = hashSync(password, HashSalt);

			const user = await UsersModel.create({
				email,
				password: hash_password,
				name,
			});

			return res.status(201).json(user);
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

export default new AuthRepository();
