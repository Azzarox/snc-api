import z from 'zod';
import { updatePostSchema } from '../posts/updatePostSchema';

export const createCommentSchema = z.object({
	content: z.string().min(1, 'Cannot be empty!'),
});

export type CreateCommentPayload = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = createCommentSchema;

export type UpdateCommentPayload = z.infer<typeof updateCommentSchema>;
