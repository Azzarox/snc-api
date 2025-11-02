import Router from '@koa/router';
import { authRouter } from './auth/authRouter';
import { userRouter } from './users/userRouter';

// Main router;
const router = new Router({
	prefix: '/v1',
});

router.use(authRouter.routes()).use(authRouter.allowedMethods());
router.use(userRouter.routes()).use(userRouter.allowedMethods());

export default router;
