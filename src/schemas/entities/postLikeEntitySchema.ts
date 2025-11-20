import z from 'zod';

export const postLikeEntitySchema = z.object({
    userId: z.number().nonnegative(),
    postId: z.number().nonnegative(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});


export type PostLikeEntity = z.infer<typeof postLikeEntitySchema>;