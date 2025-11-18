import { CreateEntity, KnexRepository, SelectColumns } from '../KnexRepository';
import { PostEntity } from '../../schemas/entities/postEntitySchema';
import { UserEntity } from '../../schemas/entities/userEntitySchema';
import { CommentEntity } from '../../schemas/entities/commentEntitySchema';

export type EnrichedPost = PostEntity & Pick<UserEntity, 'username'>;
export type EnrichedPostWithComments = EnrichedPost & { comments: CommentEntity[] & Pick<UserEntity, 'username'> };

export class PostRepository extends KnexRepository<PostEntity> {
	protected tableName = 'posts';

	private buildPostColumnsSelect(select: SelectColumns<PostEntity>, sourceTable: string): string[] {
		const postColumns =
			select === '*'
				? [`${sourceTable}.*`]
				: Array.isArray(select)
					? select.map((col) => `${sourceTable}.${String(col)}`)
					: [`${sourceTable}.${select}`];

		return postColumns;
	}

	private query(select: SelectColumns<PostEntity> = '*') {
		const postColumns = select === '*' ? `${this.tableName}.*` : select;

		return this.qb
			.select(postColumns, 'users.username')
			.from(this.tableName)
			.innerJoin('users', `${this.tableName}.userId`, 'users.id');
	}

	async getById(id: number, select: SelectColumns<PostEntity> = '*'): Promise<EnrichedPost | null> {
		return this.query(select).where(`${this.tableName}.id`, id).first() ?? null;
	}

	async getAll(select: SelectColumns<PostEntity> = '*'): Promise<EnrichedPost[]> {
		return this.query(select);
	}

	async create(data: CreateEntity<PostEntity>, select: SelectColumns<PostEntity> = '*'): Promise<EnrichedPost> {
		const postColumns = this.buildPostColumnsSelect(select, 'inserted_post');

		const enrichedPost = await this.knex
			.with('inserted_post', (qb) => {
				qb.insert(data).into(this.tableName).returning('*');
			})
			.select(...postColumns, 'users.username')
			.from('inserted_post')
			.innerJoin('users', 'inserted_post.userId', 'users.id')
			.first();

		if (!enrichedPost) {
			throw new Error('Failed to create post');
		}

		return enrichedPost;
	}

	async update(id: number, data: Partial<PostEntity>, select: SelectColumns<PostEntity> = '*'): Promise<EnrichedPost> {
		const postColumns = this.buildPostColumnsSelect(select, 'updated_post');

		const enrichedPost = await this.knex
			.with('updated_post', (qb) => {
				qb.update(data).from(this.tableName).where('id', id).returning('*');
			})
			.select(...postColumns, 'users.username')
			.from('updated_post')
			.innerJoin('users', 'updated_post.userId', 'users.id')
			.first();

		if (!enrichedPost) {
			throw new Error(`Failed to update post with id ${id}`);
		}

		return enrichedPost;
	}

	async getAllWithComments(select: SelectColumns<PostEntity> = '*'): Promise<EnrichedPostWithComments[]> {
		const postColumns = this.buildPostColumnsSelect(select, 'posts');

		const results = await this.knex
			.select(
				...postColumns,
				'users.username as username',
				this.knex.raw(`
					COALESCE(
						JSON_AGG(
							JSON_BUILD_OBJECT(
								'id', comments.id,
								'userId', comments.user_id,
								'postId', comments.post_id,
								'content', comments.content,
								'username', comment_users.username,
								'createdAt', comments.created_at,
								'updatedAt', comments.updated_at
							)
							ORDER BY comments.created_at DESC
						) FILTER (WHERE comments.id IS NOT NULL),
						'[]'
					) as comments
				`)
			)
			.from(this.tableName)
			.innerJoin('users', 'posts.user_id', 'users.id')
			.leftJoin('comments', 'posts.id', 'comments.post_id')
			.leftJoin('users as comment_users', 'comments.user_id', 'comment_users.id')
			.groupBy('posts.id', 'users.username');

		return results;
	}
}
