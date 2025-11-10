import jwtMiddleware from 'koa-jwt';
import { envConfig } from '../../config/envConfig';
import { Context, Middleware, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../common/errors/CustomHttpError';

const baseJwtMiddleware = jwtMiddleware({ secret: envConfig.JWT_SECRET, algorithms: ['HS256'], passthrough: false });

export const authMiddleware: Middleware = async (ctx: Context, next: Next) => {
	try {
		await baseJwtMiddleware(ctx, next);
	} catch (err: any) {
		if (err.status === StatusCodes.UNAUTHORIZED) {
			if ('originalError' in err) {
				switch (err.originalError.name) {
					case 'TokenExpiredError':
						throw new CustomHttpError(StatusCodes.UNAUTHORIZED, 'Session Expired! Please log in again.');
					case 'JsonWebTokenError':
						throw new CustomHttpError(StatusCodes.UNAUTHORIZED, 'Invalid Authentication Token!');
					default:
						throw new CustomHttpError(StatusCodes.UNAUTHORIZED, err.originalError.message);
				}
			}

			throw new CustomHttpError(StatusCodes.UNAUTHORIZED, 'Authentication required!');
		}
		throw err;
	}
};
