import Router from '@koa/router';
import { authRouter } from './auth/authRouter';
import { userRouter } from './users/userRouter';
import { postRouter } from './posts/postRouter';
import { authMiddleware } from '../middlewares/authMiddleware';
import { commentController } from '../controllers/comments/commentController';

// Main router;
const router = new Router({
	prefix: '/v1',
});
router.get('/ping', (ctx) => {
	ctx.status = 200
	ctx.body = {
		status: ctx.status,
		message: 'success',
	};
});
router.use(authRouter.routes()).use(authRouter.allowedMethods());
router.use(userRouter.routes()).use(userRouter.allowedMethods());
router.use(postRouter.routes()).use(postRouter.allowedMethods());
router.get('/comments', authMiddleware, commentController.getAllComments);

export default router;
