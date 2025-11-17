import z from 'zod';
import { createPostSchema } from './createPostSchema';

export const updatePostSchema = createPostSchema.partial().superRefine((data, ctx) => {
	if (!Object.values(data).some((value) => value !== undefined)) {
		ctx.addIssue({
			code: 'custom',
			message: 'At least one field must be provided to update!',
			path: ['body'],
		});
	}
});
export type UpdatePostPayload = z.infer<typeof updatePostSchema>;
