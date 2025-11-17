import z from 'zod';

export const postEntitySchema = z.object({
	id: z.number().nonnegative(),
	userId: z.number().nonnegative(),
	title: z.string().max(200, 'Please shorten the title (max 200 chars)!').nonempty('Field cannot be empty!'),
	content: z.string().nonempty('Field cannot be empty!'),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type PostEntity = z.infer<typeof postEntitySchema>;
