import { SystemErrors } from "@types";

export class HttpException extends Error {
	message!: string;
	status: number;

	constructor(status: number, message: SystemErrors) {
		super();

		if (SystemErrors[message]) {
			super.message = SystemErrors[message];
		}

		this.message = message.toString();
		this.status = status;
	}
}
