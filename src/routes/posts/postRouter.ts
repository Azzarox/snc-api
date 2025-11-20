import Router from '@koa/router';
import { postController } from '../../controllers/posts/postController';
import { authMiddleware, optionalAuthMiddleware } from '../../middlewares/authMiddleware';
import { validate } from '../../middlewares/validationMiddleware';
import { createPostSchema } from '../../schemas/posts/createPostSchema';
import { paramsSchema } from '../../schemas/common/paramsSchema';
import { updatePostSchema } from '../../schemas/posts/updatePostSchema';
import { getPostQuerySchema } from '../../schemas/posts/getPostQuerySchema';
import { commentRouter } from './commentRouter';
import { likesRouter } from './likesRouter';

export const postRouter = new Router({
	prefix: '/posts',
});

postRouter.get('/', optionalAuthMiddleware, postController.getAll);
postRouter.get('/with-comments', postController.getAllWithComments);
postRouter.get('/:id', authMiddleware, validate({ query: getPostQuerySchema, params: paramsSchema }), postController.getById);
postRouter.post('/', authMiddleware, validate({ body: createPostSchema }), postController.createPost);
postRouter.patch('/:id', authMiddleware, validate({ body: updatePostSchema, params: paramsSchema }), postController.updatePost);
postRouter.delete('/:id', authMiddleware, validate({ params: paramsSchema }), postController.deletePost);

// Mount comment router under /:id/comments
postRouter.use('/:id/comments', commentRouter.routes(), commentRouter.allowedMethods());
postRouter.use('/:id/likes', likesRouter.routes(), likesRouter.allowedMethods());
