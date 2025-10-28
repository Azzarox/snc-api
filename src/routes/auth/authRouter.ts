import Router from '@koa/router';
import { Context } from 'koa';
import { authController, users } from '../../controllers/auth/authController';
import { validate } from '../../middlewares/validationMiddleware';
import { loginSchema, registerSchema } from '../../schemas/auth/registerSchema';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';

export const authRouter = new Router({
    prefix: '/auth'
});

authRouter.post('/login', validate({body: loginSchema}), authController.loginUser)
authRouter.post('/register', validate({ body: registerSchema }), authController.registerUser)
authRouter.get('/users', authMiddleware, (ctx: Context) => {
    ctx.body = new SuccessResponse(StatusCodes.OK, null, users)
})