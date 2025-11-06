import z from 'zod';
import { authSchema } from './commonSchemas';
import { UserProfilePayload, userProfileSchema } from './userProfileSchema';

export const registerSchema = authSchema.extend(userProfileSchema.shape);

export type RegisterPayload = z.infer<typeof registerSchema>;
