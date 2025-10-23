import Koa, { Context } from 'koa';
import json from 'koa-json';
import { bodyParser } from '@koa/bodyparser';
import KoaRouter from '@koa/router';

const app = new Koa();
const router = new KoaRouter(); 

router.get('/hello', (ctx: Context) => {
    ctx.body = {
        "msg": 'hello'
    };
});

app.use(json());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

export default app;