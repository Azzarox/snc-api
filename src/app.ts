import Koa, { Context, DefaultContext } from 'koa';
import json from 'koa-json';
import { bodyParser } from '@koa/bodyparser';
import KoaRouter from '@koa/router';
import mainRouter from './routes/router'
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware';
import requestId from 'koa-requestid';
import koaPinoLogger from 'koa-pino-logger';
import loggerConfig from './config/loggerConfig';

const app = new Koa();
const router = new KoaRouter();

router.get('/hello', (ctx: Context) => {
	ctx.body = {
		msg: 'hello',
	};
});


app.use(requestId())
app.use(koaPinoLogger({
	...loggerConfig, customLogLevel: (req, res) => {
		if (res.statusCode && res.statusCode >= 400) return 'error';
		// if (ctx >= 400) return 'warn';
		return 'info';
	},
}))
app.use(json());
app.use(bodyParser());
app.use(errorHandlerMiddleware);
app.use(router.routes()).use(router.allowedMethods());
app.use(mainRouter.routes()).use(mainRouter.allowedMethods());

export default app;
