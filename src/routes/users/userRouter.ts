import Router from '@koa/router';
import { authController } from '../../controllers/auth/authController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { userController } from '../../controllers/users/userController';

export const userRouter = new Router({
	prefix: '/users',
});

userRouter.get('/profile', authMiddleware, userController.getCurrentUserProfile);

userRouter.get('/users', authMiddleware, authController.getUsers);
