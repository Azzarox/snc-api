import Router from '@koa/router';
import { authController } from '../../controllers/auth/authController';
import { validate } from '../../middlewares/validationMiddleware';
import { registerSchema } from '../../schemas/auth/registerSchema';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { loginSchema } from '../../schemas/auth/loginSchema';

export const authRouter = new Router({
	prefix: '/auth',
});

authRouter.post('/login', validate({ body: loginSchema }), authController.loginUser);
authRouter.post('/register', validate({ body: registerSchema }), authController.registerUser);

authRouter.get('/me', authMiddleware, authController.getCurrentUser);
