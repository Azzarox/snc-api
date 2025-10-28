import dotenv from 'dotenv';
import z from 'zod';

const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({ path: envPath });

const envSchema = z.object({
	PORT: z.string().min(4, '.env variable PORT is required and must have atleast 4 digits'),
	SALT: z.coerce.number().max(14, '.env variable SALT is required and must be at most 14'),
	JWT_SECRET: z.string().nonempty('.env variable JWT_SECRET is reuqired')
});

type ConfigData = z.infer<typeof envSchema>;

const env = envSchema.safeParse(process.env);
if (!env.success) {
	console.error('.env file has errors', z.flattenError(env.error));
	process.exit(1);
}

export const envConfig: ConfigData = {
	PORT: env.data.PORT,
	SALT: env.data.SALT,
	JWT_SECRET: env.data.JWT_SECRET,
};
