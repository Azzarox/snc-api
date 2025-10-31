import { Context, Next } from 'koa';
import z, { ZodError, ZodType } from 'zod';
import { paramsSchema } from '../schemas/common/paramsSchema';
import { ValidationError } from '../common/errors/ValidationError';

type Schema = {
	body?: ZodType<any>;
	params?: ZodType<any>;
	query?: ZodType<any>;
};

export const validate =
	(schema: Schema) => async (ctx: Context, next: Next) => {
		try {
			if (schema.body) {
				ctx.request.body = schema.body.parse(ctx.request.body);
			}

			if (schema.params) {
				ctx.params = schema.params.parse(ctx.params);
			}

			if (schema.query) {
				ctx.request.query = schema.query.parse(ctx.request.query);
			}

			await next();
		} catch (err) {
			if (err instanceof ZodError) {
				const errors = z.flattenError(err).fieldErrors; // NOTE: It has also form errors ...
				throw new ValidationError(errors);
			} else {
				throw err;
			}
		}
	};

export const validateIDParams = validate({ params: paramsSchema });
