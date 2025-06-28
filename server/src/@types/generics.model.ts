import { Secret, SignOptions } from "jsonwebtoken";

export const Endpoints = {
	AuthLogin: "/auth/login",
	AuthSignUp: "/auth/sign-up",
	UsersCreate: "/users",
	UsersList: "/users",
	UsersGet: "/users/:id",
	UsersUpdate: "/users/:id",
	UsersDelete: "/users/:id",
};

export const Collections = {
	Users: "Users",
};

export const HashSalt = 10;

export const JwtSecret: Secret = (process.env.JWT_SECRET as string) || "awesome_secret";
export const JwtExpiresIn: SignOptions["expiresIn"] =
	(process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d";
