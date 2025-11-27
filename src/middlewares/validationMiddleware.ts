import { DefaultContext, DefaultState, Next, ParameterizedContext } from 'koa';
import z, { ZodError, ZodType } from 'zod';
import { paramsSchema } from '../schemas/common/paramsSchema';
import { ValidationError } from '../common/errors/ValidationError';
import { Middleware } from '@koa/router';

type Schema = {
	body?: ZodType<any>;
	params?: ZodType<any>;
	query?: ZodType<any>;
};

type InferSchema<S extends Schema> = {
	body: S['body'] extends ZodType<infer B> ? B : never;
	params: S['params'] extends ZodType<infer P> ? P : never;
	query: S['query'] extends ZodType<infer Q> ? Q : never;
};

type BaseContext = ParameterizedContext<DefaultState, DefaultContext>;

type SchemaValidatedContext<S extends Schema> = {
	[K in keyof BaseContext]: K extends 'request' | 'params' | 'query' ? unknown : BaseContext[K];
} & {
	request: Omit<BaseContext['request'], 'body'> & {
		body: InferSchema<S>['body'];
	};
	params: InferSchema<S>['params'];
	query: InferSchema<S>['query'];
};

/**
 * @description
 * Using: Pass either the inferred type like "RegisterPayload" or the schema ex: "typeof registerSchema"
 * ex: ValidatedContext<RegisterPayload>
 * ex: ValidatedContext<never, typeof registerSchema>
 */
export type ValidatedContext<TBody = never, TParams = never, TQuery = never> = SchemaValidatedContext<{
	body: TBody extends ZodType<infer B> ? TBody : TBody extends never ? never : ZodType<TBody>;
	params: TParams extends ZodType<infer P> ? TParams : TParams extends never ? never : ZodType<TParams>;
	query: TQuery extends ZodType<infer Q> ? TQuery : TQuery extends never ? never : ZodType<TQuery>;
}>;

export const validate =
	<S extends Schema>(schema: S): Middleware<DefaultState, SchemaValidatedContext<S>> =>
	async (ctx: SchemaValidatedContext<S>, next: Next) => {
		try {
			if (schema.body) {
				ctx.request.body = schema.body.parse(ctx.request.body);
			}

			if (schema.params) {
				ctx.params = schema.params.parse(ctx.params);
			}

			if (schema.query) {
				ctx.query = schema.query.parse(ctx.request.query);
			}

			await next();
		} catch (err) {
			if (err instanceof ZodError) {
				const errors = z.flattenError(err).fieldErrors;
				throw new ValidationError(errors);
			} else {
				throw err;
			}
		}
	};

export const validateIDParams = validate({ params: paramsSchema });
