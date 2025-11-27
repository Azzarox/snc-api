import { Knex } from 'knex';
import { DB_USER_SEEDS } from './20251102202749_users';
import { PostEntity } from '../src/schemas/entities/postEntitySchema';

export async function seed(knex: Knex): Promise<void> {
	await knex('posts').del();

	const seed = DB_USER_SEEDS.find((u) => u.username === 'test123');
	if (!seed) throw new Error('No user seed found!');

	const user = await knex('users').where({ username: seed.username }).first();
	if (!user) {
		throw new Error('User not found for posts seeding');
	}

	for (let i = 1; i < 4; i++) {
		const post: Partial<PostEntity> = {
			userId: user.id,
			title: `Random Post by ${user.username}: Number ${i}`,
			content:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		};

		await knex('posts').insert(post);
	}
}
