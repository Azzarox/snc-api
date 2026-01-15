import { koaSwagger } from 'koa2-swagger-ui';
import yamljs from 'yamljs';
import path from 'path';

const spec = yamljs.load(path.join(__dirname, '../swagger.yml'));
export default koaSwagger({ routePrefix: false, swaggerOptions: { spec } });
