import app from './app';
import { envConfig } from '../config/envConfig';
import { connectDB } from '../config/knexConfig';
import { pinoLogger } from './config/loggerConfig';

connectDB()
	.then(() => {
		pinoLogger.info('Database connected successfully');
		app.listen(envConfig.PORT, () => {
			pinoLogger.info(`Server is running! Listening on port: ${envConfig.PORT}`);
		});
	})
	.catch((error) => {
		pinoLogger.error({ err: error }, 'Failed to connect to database');
		process.exit(1);
	});
