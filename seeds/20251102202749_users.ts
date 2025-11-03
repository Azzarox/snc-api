import { Knex } from 'knex';
import { UserEntity } from '../src/schemas/entities/userEntitySchema';

export const DB_USER_SEEDS: Partial<UserEntity>[] = [
	{
		username: 'test123',
		password: '$2b$10$kEU7Auoy3D3u8r6ve6577Oqx7Zvt0dzONwKzE5UDPw.EtlsGmoWHG',
		email: 'test123@gmail.com',
	}
];

export async function seed(knex: Knex): Promise<void> {
	await knex('users').del();
	await knex('users').insert(DB_USER_SEEDS);
}
