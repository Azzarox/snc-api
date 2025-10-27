import z from "zod";

export const registerSchema = z.object({
    username: z.string().nonempty('Cannot be empty@'),
    password: z.string().nonempty('Cannot be empty@')
})

export type RegisterPayload = z.infer<typeof registerSchema>;
