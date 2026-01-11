import dotenv from 'dotenv';
import z from 'zod';

const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({ path: envPath });

const envSchema = z.object({
	PORT: z.string().min(4, '.env variable PORT is required and must have atleast 4 digits'),
	SALT: z.coerce.number().max(14, '.env variable SALT is required and must be at most 14'),
	JWT_SECRET: z.string().nonempty('.env variable JWT_SECRET is reuqired'),
	POSTGRES_USER: z.string().nonempty('.env variable POSTGRES_USER is required'),
	POSTGRES_PASSWORD: z.string().nonempty('.env variable is POSTGRES_PASSWORD required'),
	POSTGRES_HOST: z.string().nonempty('.env variable is POSTGRES_HOST required'),
	POSTGRES_DB: z.string().nonempty('.env variable is POSTGRES_DB required'),
	POSTGRES_DB_PORT: z.string().min(4, '.env variable POSTGRES_DB_PORT is required must have atleast 4 digits'),
	CLOUDINARY_URL: z.string().nonempty('.env variable CLOUDINARY_URL is required!'),
	FRONTEND_CORS_ORIGIN: z.url('.env variable FRONTEND_CORS_ORIGIN is required!'),
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
	POSTGRES_USER: env.data.POSTGRES_USER,
	POSTGRES_PASSWORD: env.data.POSTGRES_PASSWORD,
	POSTGRES_HOST: env.data.POSTGRES_HOST,
	POSTGRES_DB: env.data.POSTGRES_DB,
	POSTGRES_DB_PORT: env.data.POSTGRES_DB_PORT,
	CLOUDINARY_URL: env.data.CLOUDINARY_URL,
	FRONTEND_CORS_ORIGIN: env.data.FRONTEND_CORS_ORIGIN,
};
