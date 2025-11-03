import { Knex } from 'knex';
import { DB_USER_SEEDS } from './20251102202749_users';
import { UserProfileEntity} from '../src/schemas/entities/userProfileEntitySchema'

const DB_USER_PROFILE_SEEDS: Partial<UserProfileEntity>[] = [
	{
		first_name: 'Test',
		last_name: 'Testing',
		bio: 'This is user Test Testing bio',
		description: 'I am user test testing ...'
	}
];

export async function seed(knex: Knex): Promise<void> {
	await knex('user_profiles').del();

	const userSeed = DB_USER_SEEDS[0];
	if (!userSeed) {
		throw new Error('No user seed data found');
	}

	const user = await knex('users').where({ username: userSeed.username }).first();

	if (!user) {
		throw new Error('User not found for profile seeding');
	}

	const userProfile = DB_USER_PROFILE_SEEDS[0];
	if (!userProfile) {
		throw new Error('No user profile seed data found');
	}

	userProfile.user_id = user.id;

	await knex('user_profiles').insert([userProfile]);
}
