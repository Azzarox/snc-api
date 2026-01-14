import Koa, { Context } from 'koa';
import json from 'koa-json';
import { bodyParser } from '@koa/bodyparser';
import KoaRouter from '@koa/router';
import mainRouter from './routes/router';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware';
import requestId from 'koa-requestid';
import koaPinoLogger from 'koa-pino-logger';
import loggerConfig from './config/loggerConfig';
import { envConfig } from '../config/envConfig';
import cors from '@koa/cors';
import compress from 'koa-compress'
import { rateLimitMiddleware } from './middlewares/rateLimitMiddleware';

const app = new Koa();
const router = new KoaRouter();

router.get('/', (ctx: Context) => {
	ctx.redirect('/v1/docs');
});

app.use(requestId());
app.use(compress());
app.use(
	koaPinoLogger({
		...loggerConfig,
		customLogLevel: (_req, res) => {
			if (res.statusCode && res.statusCode >= 400) return 'error';
			return 'info';
		},
		customProps: (ctx) => ({
			userId: (ctx as unknown as Context).state?.user?.id || null,
		}),
	})
);
app.use(cors({
	origin: envConfig.FRONTEND_CORS_ORIGIN,
	credentials: true,
}));
app.use(rateLimitMiddleware);

app.use(json());
app.use(bodyParser());
app.use(errorHandlerMiddleware);
app.use(router.routes()).use(router.allowedMethods());
app.use(mainRouter.routes()).use(mainRouter.allowedMethods());

export default app;
