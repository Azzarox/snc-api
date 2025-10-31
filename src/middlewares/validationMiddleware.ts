import { DefaultContext, DefaultContextExtends, DefaultState, Next, ParameterizedContext } from "koa"
import z, { ZodError, ZodType } from "zod"
import { paramsSchema } from "../schemas/common/paramsSchema"
import { ValidationError } from "../common/errors/ValidationError"
import { Middleware } from "@koa/router"

type Schema = {
    body?: ZodType<any>
    params?: ZodType<any>
    query?: ZodType<any>
}

type InferSchema<S extends Schema> = {
    body: S['body'] extends ZodType<infer B> ? B : never
    params: S['params'] extends ZodType<infer P> ? P : never
    query: S['query'] extends ZodType<infer Q> ? Q : never
}

type BaseContext = ParameterizedContext<DefaultState, DefaultContext>

type OmitContextProperties<T extends keyof BaseContext> = Omit<BaseContext, T>
type OmitSpecificContextProperties<K extends keyof BaseContext, T extends keyof BaseContext> = Omit<BaseContext[K], T>

export type ValidatedContext<S extends Schema> =OmitContextProperties<'request' | 'params' | 'query'> & {
    request: OmitSpecificContextProperties<'request', 'body'> & {
        body: InferSchema<S>['body']
    }
    params: InferSchema<S>['params'],
    query: InferSchema<S>['query'],
}


export const validate = <S extends Schema>(schema: S): Middleware<DefaultState, ValidatedContext<S>> => 
    async (ctx:  ValidatedContext<S>, next: Next) => {
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
                const errors = z.flattenError(err).fieldErrors;
                throw new ValidationError(errors)
            } else {
                throw err;
            }
        }
    }

export const validateIDParams = validate({ params: paramsSchema });
