import pino from 'pino';
import loggerConfig from '../../config/loggerConfig';
import { Context } from 'koa';

const pinoLogger = pino(loggerConfig);

const logError = (ctx: Context, err: unknown) => {
	pinoLogger.error(
		{
			err,
			requestId: ctx.state.id,
			method: ctx.method,
			path: ctx.path,
			status: ctx.status,
			ip: ctx.ip,
		},
		(err as Error).message || 'Unhandled error'
	);
};

export const loggerService = {
	logError,
};
