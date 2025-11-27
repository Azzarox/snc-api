import z from 'zod';

export const userEntitySchema = z.object({
	id: z.number().nonnegative(),
	username: z.string().min(1, 'Field cannot be empty!'),
	password: z.string().min(1, 'Field cannot be empty!'),
	email: z.email('Field cannot be empty!'),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type UserEntity = z.infer<typeof userEntitySchema>;
