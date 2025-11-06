import z from 'zod';
import { authSchema } from './commonSchemas';

export const loginSchema = z.union([
	authSchema.pick({ username: true, password: true }).strict(),
	authSchema.pick({ email: true, password: true }).strict(),
]);

export type LoginPayload = z.infer<typeof loginSchema>;
