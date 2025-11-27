import z from 'zod';
import { paramsSchema } from '../common/paramsSchema';

export const commentParamsSchema = paramsSchema.extend({ commentId: z.coerce.number() });

export type CommentParams = z.infer<typeof commentParamsSchema>;
