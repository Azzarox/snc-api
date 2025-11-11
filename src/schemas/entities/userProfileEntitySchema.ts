import z from 'zod';

export const userProfileEntitySchema = z.object({
	id: z.number().nonnegative(),
	userId: z.number().nonnegative(),
	firstName: z.string().min(1, 'Please enter a first name!'),
	lastName: z.string().min(1, 'Please enter a last name!'),
	bio: z.string().max(60, 'Please shorten the bio information!').optional(),
	description: z.string().max(255, 'Please shorten the description information!').optional(),

	avatarUrl: z.string().nullable().optional(),
	avatarStorageKey: z.string().nullable().optional(),
	coverUrl: z.string().nullable().optional(),
	coverStorageKey: z.string().nullable().optional(),

	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type UserProfileEntity = z.infer<typeof userProfileEntitySchema>;
