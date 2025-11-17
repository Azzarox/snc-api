import z from 'zod';

export const postEntitySchema = z.object({
	id: z.number().nonnegative(),
	userId: z.number().nonnegative(),
	title: z.string().min(1, 'Field cannot be empty!').max(200, 'Field data too long! Max 200!'),
	content: z.string().min(1, 'Field cannot be empty!'),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type PostEntity = z.infer<typeof postEntitySchema>;
