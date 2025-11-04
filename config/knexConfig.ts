import knex from 'knex';
import dotenv from 'dotenv';
import { envConfig } from './envConfig';
import knexStringcase from 'knex-stringcase';

dotenv.config();

const options = {
	client: 'pg',
	connection: {
		host: envConfig.POSTGRES_HOST,
		port: Number(envConfig.POSTGRES_DB_PORT),
		user: envConfig.POSTGRES_USER,
		password: envConfig.POSTGRES_PASSWORD,
		database: envConfig.POSTGRES_DB,
	},
};

export const connectDB = () => db.raw('SELECT 1');

export const knexSetup = knexStringcase(options);
export const db = (knex(knexSetup));
