import { Server } from 'http';
import { Knex } from 'knex';
import { Logger } from 'pino';

export const setupGracefulShutdown = (
	server: Server,
	db: Knex,
	logger: Logger
) => {
	const shutdown = async (signal: string) => {
		logger.info(`${signal} received, shutting down...`);
		server.close();
		await db.destroy();
		logger.info('Cleanup complete');
		process.exit(0);
	};

	process.on('SIGTERM', () => shutdown('SIGTERM'));
	process.on('SIGINT', () => shutdown('SIGINT'));
};
