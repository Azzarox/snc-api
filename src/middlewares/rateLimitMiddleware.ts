import ratelimit from 'koa-ratelimit';

const db = new Map();

// TODO: If there is need, implement isDev or isProd disable rateLimit or up the requests available

export const rateLimitMiddleware = ratelimit({
	driver: 'memory',
	db: db,
	duration: 60000, 				// 1 minute window
	max: 100, 						// 100 requests per minute per IP
	errorMessage: 'Too many requests, please try again later.',
	id: (ctx) => ctx.ip,
	headers: {
		remaining: 'X-RateLimit-Remaining',
		reset: 'X-RateLimit-Reset',
		total: 'X-RateLimit-Limit',
	},
	disableHeader: false,
});
