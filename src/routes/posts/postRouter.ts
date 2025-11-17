import Router from '@koa/router';
import { postController } from '../../controllers/posts/postController';

export const postRouter = new Router({
	prefix: '/posts',
});

postRouter.get('/', postController.getAll);
