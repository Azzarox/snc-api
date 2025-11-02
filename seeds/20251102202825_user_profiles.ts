import { Knex } from 'knex';
import { DB_USER_SEEDS } from './20251102202749_users';

export async function seed(knex: Knex): Promise<void> {
	await knex('user_profiles').del();

	const user = await knex('users').where({ username: DB_USER_SEEDS[0].username }).first();

	await knex('user_profiles').insert([
		{
			user_id: user.id,
			first_name: 'Test',
			last_name: 'Testing',
		},
	]);
}
