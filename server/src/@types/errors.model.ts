export enum SystemErrors {
	USER_NOT_FOUND = "USER_NOT_FOUND",
	INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
	UNAUTHORIZED = "UNAUTHORIZED",
	CREW_NOT_FOUND = "CREW_NOT_FOUND",
}

export type TSystemErrors = keyof typeof SystemErrors;
