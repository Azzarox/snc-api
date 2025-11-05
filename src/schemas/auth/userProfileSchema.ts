import z from "zod";

export const userProfileSchema = z.object({
    firstName: z.string().min(1, 'Please enter a first name!'),
    lastName: z.string().min(1, 'Please enter a last name!'),
    bio: z.string().max(120, 'Please shorten the bio information!').optional(),
    description: z.string().max(255, 'Please shorten the description information!').optional(),

    // primarySkill: z.string().optional(),
    // yearsExperience: z.string().optional(),
})

export type UserProfilePayload = z.infer<typeof userProfileSchema>