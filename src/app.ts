import Koa, { Context } from 'koa';
import json from 'koa-json';
import { bodyParser } from '@koa/bodyparser';
import KoaRouter from '@koa/router';
import mainRouter from './routes/router';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware';
const app = new Koa();
const router = new KoaRouter();

router.get('/hello', (ctx: Context) => {
	ctx.body = {
		msg: 'hello',
	};
});

app.use(json());
app.use(bodyParser());
app.use(errorHandlerMiddleware);
app.use(router.routes()).use(router.allowedMethods());
app.use(mainRouter.routes()).use(mainRouter.allowedMethods());

export default app;
