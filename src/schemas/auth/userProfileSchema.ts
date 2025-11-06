import z from "zod";

export const userProfileSchema = z.object({
    firstName: z.string().min(1, 'Please enter a first name!').max(50, 'First name is too long!'),
    lastName: z.string().min(1, 'Please enter a last name!').max(50, 'Last name is too long!'),
    bio: z.string().max(120, 'Please shorten the bio information!').optional(),
    description: z.string().max(255, 'Please shorten the description information!').optional(),

    // primarySkill: z.string().optional(),
    // yearsExperience: z.string().optional(),
})

export const updateUserProfileSchema = userProfileSchema.partial().superRefine((data, ctx) => {
      if (!Object.values(data).some((value) => value !== undefined)) {
          ctx.addIssue({
              code: "custom",
              message: 'At least one field must be provided to update!',
              path: ['body'],
          });
      }
  });

export type UserProfilePayload = z.infer<typeof userProfileSchema>
export type UpdateUserProfilePayload = z.infer<typeof updateUserProfileSchema>
