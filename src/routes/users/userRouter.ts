import Router from '@koa/router';
import { Context } from 'koa';
import { authController } from '../../controllers/auth/authController';
import { validate } from '../../middlewares/validationMiddleware';
import { loginSchema, registerSchema } from '../../schemas/auth/registerSchema';
import { authService } from '../../services/auth/authService';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { userController } from '../../controllers/users/userController';

export const userRouter = new Router({
    prefix: '/users',
});

userRouter.get('/profile', authMiddleware, userController.getCurrentUserProfile);

userRouter.get('/users', authMiddleware, authController.getUsers);
