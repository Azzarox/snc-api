import z from 'zod';
import { userEntitySchema } from '../entities/userEntitySchema';

export const registerSchema = userEntitySchema.pick({
	username: true,
	password: true,
})

export type RegisterPayload = z.infer<typeof registerSchema>;

export const loginSchema = registerSchema;
export type LoginPayload = z.infer<typeof loginSchema>;
