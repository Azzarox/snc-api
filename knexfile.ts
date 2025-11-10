import { Knex } from 'knex';
import { knexSetup } from './config/knexConfig';

const migrations = {
	tableName: 'knex_migrations',
	extension: 'ts',
};

const seeds = {
	directory: './seeds/',
	extension: 'ts',
};

const knexConfig: { [key: string]: Knex.Config } = {
	development: {
		client: knexSetup.client,
		connection: knexSetup.connection,
		pool: {
			min: 2,
			max: 10,
		},
		migrations,
		seeds,
	},
};

export default knexConfig;
