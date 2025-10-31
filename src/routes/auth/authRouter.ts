import Router from '@koa/router';
import { Context } from 'koa';
import { authController } from '../../controllers/auth/authController';
import { validate } from '../../middlewares/validationMiddleware';
import { loginSchema, registerSchema } from '../../schemas/auth/registerSchema';
import { authService } from '../../services/auth/authService';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';

export const authRouter = new Router({
	prefix: '/auth',
});

authRouter.post('/login', validate({ body: loginSchema }), authController.loginUser);
authRouter.post('/register', validate({ body: registerSchema }), authController.registerUser);

authRouter.get('/me', authMiddleware, (ctx: Context) => {
	const response = new SuccessResponse(StatusCodes.OK, null, ctx.state.user); //TODO: add ctx.state.user type later
	ctx.body = response;
	ctx.status = response.status;
});

authRouter.get('/users', authMiddleware, (ctx: Context) => {
	ctx.body = new SuccessResponse(StatusCodes.OK, null, authService.users);
});
