import { Knex } from 'knex';
import { DB_USER_SEEDS } from './20251102202749_users';
import { PostLikeEntity } from '../src/schemas/entities/postLikeEntitySchema';

export async function seed(knex: Knex): Promise<void> {
	await knex('post_likes').del();

	const seed = DB_USER_SEEDS.find((u) => u.username === 'test123');
	if (!seed) throw new Error('No user seed found!');

	const user = await knex('users').where({ username: seed.username }).first();
	if (!user) {
		throw new Error('User not found for posts seeding');
	}

	const userPosts = await knex('posts').where({ userId: user.id }).limit(3);
	if (!userPosts.length) {
		throw new Error("User doesn't have posts!");
	}

	let counter = 0;
	for (const post of userPosts) {
		counter++;
		const like: Partial<PostLikeEntity> = {
			postId: post.id,
			userId: user.id,
		};

		await knex('post_likes').insert(like);
	}
}
