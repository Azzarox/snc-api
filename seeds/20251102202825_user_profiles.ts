import { Knex } from 'knex';
import { DB_USER_SEEDS } from './20251102202749_users';
import { UserProfileEntity } from '../src/schemas/entities/userProfileEntitySchema';
import { generateDefaultAvatarUrl } from '../src/utils/generateAvatarImage';
import { generateDefaultCoverUrl } from '../src/utils/generateCoverImage';

const DB_USER_PROFILE_SEEDS: Record<string, Partial<UserProfileEntity>> = {
	test123: {
		firstName: 'Test',
		lastName: 'Testing',
		bio: 'This is user Test Testing bio',
		description: 'I am user test testing ...',
		avatarStorageKey: null,
		coverStorageKey: null,
	},
	sarah: {
		firstName: 'Sarah',
		lastName: 'Michael',
		bio: `Acoustic guitarist & songwriter | Martin D-28 enthusiast | Teaching guitar online`,
		description: `Professional guitarist and music educator
		with over 10 years of experience.
		Specializing in acoustic fingerstyle and
		contemporary songwriting. I love sharing my
		passion for music and helping others on
		their guitar journey.`,
		avatarStorageKey: null,
		coverStorageKey: null,
	},
};

export async function seed(knex: Knex): Promise<void> {
	await knex('user_profiles').del();

	for (const userSeed of DB_USER_SEEDS) {
		if (!userSeed) {
			throw new Error('No user seed data found');
		}

		const user = await knex('users').where({ username: userSeed.username }).first();

		if (!user) {
			throw new Error('User not found for profile seeding');
		}

		const userProfile = DB_USER_PROFILE_SEEDS[user.username];
		if (!userProfile) {
			throw new Error('No user profile seed data found');
		}

		userProfile.userId = user.id;
		userProfile.avatarUrl = generateDefaultAvatarUrl(user.id);
		userProfile.coverUrl = generateDefaultCoverUrl(user.id);

		await knex('user_profiles').insert([userProfile]);
	}
}
