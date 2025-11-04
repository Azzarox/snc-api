import { Knex } from 'knex';

export const DB_USER_SEEDS = [
	{
		username: 'test123',
		password: '$2b$10$kEU7Auoy3D3u8r6ve6577Oqx7Zvt0dzONwKzE5UDPw.EtlsGmoWHG',
	},
] as const;

export async function seed(knex: Knex): Promise<void> {
	await knex('users').del();
	await knex('users').insert(DB_USER_SEEDS);
}
