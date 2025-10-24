import Router from '@koa/router';
import { authRouter } from './auth/authRouter';

// Main router;
const router = new Router({
    'prefix': '/v1'
});


router.use(authRouter.routes()).use(authRouter.allowedMethods());


export default router;