import z from 'zod';

export const userEntitySchema = z.object({
  id: z.number().nonnegative(),
  username: z.string().nonempty('Field cannot be empty!'),
  password: z.string().nonempty('Field cannot be empty!'),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type UserEntity = z.infer<typeof userEntitySchema>;