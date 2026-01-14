import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const loggerConfig = {
	level: isDev ? 'debug' : 'info',
	base: {
		env: process.env.NODE_ENV || 'development',
	},
	...(isDev && {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'yyyy-mm-dd HH:MM:ss',
				ignore: 'pid,hostname',
			},
		},
	}),
	serializers: {
		err: pino.stdSerializers.err,
		req(req: any) {
			const { method, url, headers, remoteAddress } = req;

			return {
				id: req.id,
				method,
				url,
				remoteAddress,
				headers: {
					host: headers['host'],
					'user-agent': headers['user-agent'],
					'content-type': headers['content-type'],
				},
			};
		},
		res(res: any) {
			const { statusCode, headers } = res;

			return {
				statusCode,
				contentLength: headers['content-length'],
				headers: {
					'request-id': headers['request-id'],
					'content-type': headers['content-type'],
				},
			};
		},
	},
};

export const pinoLogger = pino(loggerConfig);

export default loggerConfig;
