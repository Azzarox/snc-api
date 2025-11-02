import z from 'zod';

export const userProfileEntitySchema = z.object({
	id: z.number().nonnegative(),
	user_id: z.number().nonnegative(),
	first_name: z.string().nullable(),
	last_name: z.string().nullable(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});

export type UserProfileEntity = z.infer<typeof userProfileEntitySchema>;
