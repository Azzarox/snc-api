import Router from '@koa/router';
import { Context } from 'koa';
import { authController, users } from '../../controllers/auth/authController';
import { validate } from '../../middlewares/validationMiddleware';
import { registerSchema } from '../../schemas/auth/registerSchema';
import { authService } from '../../services/auth/authService';

export const authRouter = new Router({
	prefix: '/auth',
});

authRouter.post('/login', (ctx: Context) => {});
authRouter.post(
	'/register',
	validate({ body: registerSchema }),
	authController.registerUser
);
authRouter.get('/', (ctx: Context) => {
	ctx.body = authService.users;
	ctx.status = 201;
});
