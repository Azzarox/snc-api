import { Context, Next } from "koa";
import { isCustomHttpError } from "../common/guards/isCustomHttpError";
import { StatusCodes } from "http-status-codes";
import { isValidationError } from "../common/guards/isValidationError";

const errorHandlerMiddleware = async (ctx: Context, next: Next) => {
	try {
		await next();
	} catch (err: unknown) {
		if (isCustomHttpError(err) || isValidationError(err)) {
			ctx.status = err.status
			ctx.body = {
				success: false,
				message: err.message,
				status: err.status,
				...(err.errors && { errors: err.errors }),
			}

		} else {
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR 
			ctx.body = {
				success: false,
				message: err !== null 
				&& err !== undefined 
				&& typeof err === 'object' 
				&& 'message' in err ? 
				err.message : 'Oops! Something went wrong!',
				status: ctx.status
			};
		}
		ctx.app.emit('error', err, ctx);
	}
}

export default errorHandlerMiddleware;