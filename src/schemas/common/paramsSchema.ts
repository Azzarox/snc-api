import z from 'zod';

export const paramsSchema = z.object({
	id: z.coerce.number(),
});

export type GenericParams = z.infer<typeof paramsSchema>;