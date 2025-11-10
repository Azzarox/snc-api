import z from 'zod';

export const authSchema = z.object({
	username: z.string().min(3, 'Username must be at least 3 characters').nonempty('Please enter a username!'),
	email: z.email('Please enter valid email!'),
	password: z.string().min(6, 'Password must be at least 6 characters long!'),
});
