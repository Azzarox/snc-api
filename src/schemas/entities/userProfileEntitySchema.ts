import z from 'zod';

export const userProfileEntitySchema = z.object({
	id: z.number().nonnegative(),
	user_id: z.number().nonnegative(),
	first_name: z.string().min(1, 'Please enter a first name!'),
	last_name: z.string().min(1, 'Please enter a last name!'),
	bio: z.string().max(60, 'Please shorten the bio information!').optional(),
	description: z.string().max(255, 'Please shorten the description information!').optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});

export type UserProfileEntity = z.infer<typeof userProfileEntitySchema>;
