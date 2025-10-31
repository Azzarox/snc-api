import { StatusCodes } from 'http-status-codes';
import { Errors } from './shared/types';

export class ValidationError extends Error {
	public status: StatusCodes;

	constructor(public errors: Errors) {
		super();
		this.status = StatusCodes.BAD_REQUEST;
		this.message = 'Validation Error';
		this.errors = errors;

		Object.setPrototypeOf(this, new.target.prototype);
	}
}
