import Router from '@koa/router';
import { Context } from 'koa';
import { authController, users } from '../../controllers/auth/authController';
import { validate } from '../../middlewares/validationMiddleware';
import { loginSchema, registerSchema } from '../../schemas/auth/registerSchema';

export const authRouter = new Router({
	prefix: '/auth',
});

authRouter.post(
	'/login',
	validate({ body: loginSchema }),
	authController.loginUser
);
authRouter.post(
	'/register',
	validate({ body: registerSchema }),
	authController.registerUser
);
authRouter.get('/', (ctx: Context) => {
	ctx.body = users;
	ctx.status = 201;
});
