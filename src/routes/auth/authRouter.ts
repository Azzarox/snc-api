import Router from '@koa/router';
import { Context } from 'koa';
import { authController, users } from '../../controllers/auth/authController';

export const authRouter = new Router({
    prefix: '/auth'
});

authRouter.post('/login', (ctx: Context) => {})
authRouter.post('/register', authController.registerUser)
authRouter.get('/', (ctx: Context) => {
    ctx.body = users;
    ctx.status = 201;
})