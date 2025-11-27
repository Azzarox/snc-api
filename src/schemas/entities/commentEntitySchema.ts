import z from 'zod';

export const commentEntitySchema = z.object({
	id: z.number().nonnegative(),
	userId: z.number().nonnegative(),
	postId: z.number().nonnegative(),
	content: z.string().min(1, 'Field cannot be empty!'),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type CommentEntity = z.infer<typeof commentEntitySchema>;
