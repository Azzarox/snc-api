import Router from '@koa/router';
import { validate } from '../../middlewares/validationMiddleware';
import { commentController } from '../../controllers/comments/commentController';
import { paramsSchema } from '../../schemas/common/paramsSchema';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { commentParamsSchema } from '../../schemas/comments/commentParamSchema';

export const commentRouter = new Router();

commentRouter.get('/', authMiddleware, validate({params: paramsSchema}), commentController.getAllPostComments);
commentRouter.post('/', authMiddleware, validate({ params: paramsSchema }), commentController.createComment);
commentRouter.patch('/:commentId', authMiddleware, validate({ params: commentParamsSchema }), commentController.updateComment);
commentRouter.delete('/:commentId', authMiddleware, validate({ params: commentParamsSchema }), commentController.deleteComment);
