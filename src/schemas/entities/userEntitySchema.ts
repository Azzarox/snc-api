import z from 'zod';

export const userEntitySchema = z.object({
	id: z.number().nonnegative(),
	username: z.string().nonempty('Field cannot be empty!'),
	password: z.string().nonempty('Field cannot be empty!'),
	email: z.string().nonempty('Field cannot be empty!'),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type UserEntity = z.infer<typeof userEntitySchema>;
