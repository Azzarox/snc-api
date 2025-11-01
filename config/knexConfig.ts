
import knex from 'knex'
import dotenv from 'dotenv';
import {envConfig} from './envConfig';

dotenv.config();

const setup = {
    client: 'pg',
    connection: {
        host: envConfig.POSTGRES_HOST,
        port: Number(envConfig.POSTGRES_DB_PORT),
        user: envConfig.POSTGRES_USER,
        password: envConfig.POSTGRES_PASSWORD,
        database: envConfig.POSTGRES_DB,
    }
};
export const knexSetup = setup;
export const db = knex(setup);