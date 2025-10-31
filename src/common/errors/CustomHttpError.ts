import { StatusCodes } from 'http-status-codes';
import { Errors } from './shared/types';

export class CustomHttpError extends Error {
	constructor(
		public status: StatusCodes,
		public message: string,
		public errors?: Errors
	) {
		super();
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
