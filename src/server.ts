import app from './app';
import { envConfig } from '../config/envConfig';
import { connectDB, db } from '../config/knexConfig';
import { pinoLogger } from './config/loggerConfig';
import { setupGracefulShutdown } from './utils/gracefulShutdown';

connectDB()
	.then(() => {
		pinoLogger.info('Database connected successfully');
		const server = app.listen(envConfig.PORT, () => {
			pinoLogger.info(`Server is running! Listening on port: ${envConfig.PORT}`);
		});
		setupGracefulShutdown(server, db, pinoLogger);
	})
	.catch((error) => {
		pinoLogger.error({ err: error }, 'Failed to connect to database');
		process.exit(1);
	});
