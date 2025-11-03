import z from 'zod';

const authSchema = z.object({
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters')
		.nonempty('Please enter a username!'),
	email: z.email('Please enter valid email!'),
	password: z.string().min(6, 'Password must be at least 6 characters long!'),
});

export const userProfileSchema = z.object({
	firstName: z.string().min(1, 'Please enter a first name!'),
	lastName: z.string().min(1, 'Please enter a last name!'),
	bio: z.string().max(60, 'Please shorten the bio information!').optional(),
	description: z.string().max(255, 'Please shorten the description information!').optional(),

	// primarySkill: z.string().optional(),
	// yearsExperience: z.string().optional(),
})

export const registerSchema = authSchema.extend(userProfileSchema.shape);

export type RegisterPayload = z.infer<typeof registerSchema>;

export const loginSchema = registerSchema;
export type LoginPayload = z.infer<typeof loginSchema>;
