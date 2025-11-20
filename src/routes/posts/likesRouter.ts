import Router from '@koa/router';
import { validate } from '../../middlewares/validationMiddleware';
import { paramsSchema } from '../../schemas/common/paramsSchema';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { likeController } from '../../controllers/likes/likeController';

export const likesRouter = new Router();

likesRouter.post('/', authMiddleware, validate({ params: paramsSchema }), likeController.toggleLike);
likesRouter.get('/', authMiddleware, validate({ params: paramsSchema }), likeController.getPostLikes);
