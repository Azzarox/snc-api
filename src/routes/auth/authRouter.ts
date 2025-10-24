import Router from '@koa/router';
import { Context } from 'koa';
import { authController } from '../../controllers/auth/authController';

export const authRouter = new Router({
    prefix: '/auth'
});

authRouter.post('/login', (ctx: Context) => {})
authRouter.post('/register', authController.registerUser)