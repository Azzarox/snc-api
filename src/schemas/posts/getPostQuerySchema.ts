import z from 'zod';

export const getPostQuerySchema = z.object({
	includeComments: z.enum(['true', 'false']).default('false'),
});

export type GetPostQuery = z.infer<typeof getPostQuerySchema>;
