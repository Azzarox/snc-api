import Router from '@koa/router';
import { postController } from '../../controllers/posts/postController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validate } from '../../middlewares/validationMiddleware';
import { createPostSchema } from '../../schemas/posts/createPostSchema';
import { paramsSchema } from '../../schemas/common/paramsSchema';
import { updatePostSchema } from '../../schemas/posts/updatePostSchema';
import { commentRouter } from './commentRouter';

export const postRouter = new Router({
	prefix: '/posts',
});

postRouter.get('/', postController.getAll);
postRouter.get('/:id', authMiddleware, postController.getById);
postRouter.post('/', authMiddleware, validate({ body: createPostSchema }), postController.createPost);
postRouter.patch('/:id', authMiddleware, validate({ body: updatePostSchema, params: paramsSchema }), postController.updatePost);
postRouter.delete('/:id', authMiddleware, validate({ params: paramsSchema }), postController.deletePost);

// Mount comment router under /:id/comments
// Note: /:id validation should be done inside comment routes
postRouter.use('/:id/comments', commentRouter.routes(), commentRouter.allowedMethods());
