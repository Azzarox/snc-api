import Router from '@koa/router';
import swaggerConfig from '../../../config/swaggerConfig';

export const docsRouter = new Router();

docsRouter.get('/docs', swaggerConfig);
