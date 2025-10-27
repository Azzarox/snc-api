import { Context, Next } from "koa";
import { isCustomHttpError } from "../common/guards/isCustomHttpError";
import { StatusCodes } from "http-status-codes";
import { isValidationError } from "../common/guards/isValidationError";
import { ErrorResponse, FailResponse } from "../common/response/Response";
import { hasErrorMessage } from "../common/guards/hasErrorMessage";
import { loggerService } from "../services/logger/loggerService";

const errorHandlerMiddleware = async (ctx: Context, next: Next) => {
	try {
		await next();
	} catch (err: unknown) {
		if (isCustomHttpError(err)) {
			const response = new FailResponse(err.status, err.message);
			ctx.status = response.status;
			ctx.body = response;
		} else if (isValidationError(err)) {
			const response = new ErrorResponse(err.status, err.message, err.errors);
			ctx.status = response.status;
			ctx.body = response;
		}
		else {
			const message = hasErrorMessage(err) ? err.message : 'Oops! Something went wrong!';
			const response = new FailResponse(StatusCodes.INTERNAL_SERVER_ERROR, message)

			ctx.status = StatusCodes.INTERNAL_SERVER_ERROR
			ctx.body = response;
		}

		loggerService.logError(ctx, err);
		// ctx.app.emit('error', err, ctx);
	}
}

export default errorHandlerMiddleware;