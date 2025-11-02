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

authRouter.get('/me', authMiddleware, authController.getCurrentUser);

authRouter.get('/users', authMiddleware, authController.getUsers);
