import { Knex } from 'knex';
import { DB_USER_SEEDS } from './20251102202749_users';
import { PostEntity } from '../src/schemas/entities/postEntitySchema';
import { PostRepository, postsRepository } from '../src/repositories';
import { CommentEntity } from '../src/schemas/entities/commentEntitySchema';

export async function seed(knex: Knex): Promise<void> {
	await knex('comments').del();

	const seed = DB_USER_SEEDS.find((u) => u.username === 'test123');
	if (!seed) throw new Error('No user seed found!');

	const user = await knex('users').where({ username: seed.username }).first();
	if (!user) {
		throw new Error('User not found for posts seeding');
	}

	const userPosts = await postsRepository.find({userId: user.id});
    if (!userPosts.length) {
		throw new Error('User doesn\'t have posts!');
	}

    let counter = 0;
    for (const post of userPosts) {
        counter++;
        const comment: Partial<CommentEntity> = {
            postId: post.id,
            userId: user.id,
            content: `This is a comment from seed! Number: ${counter}`
        }

        await knex('comments').insert(comment);
    }
}
