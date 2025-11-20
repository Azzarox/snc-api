import { CreateEntity, KnexRepository, SelectColumns } from '../KnexRepository';
import { PostEntity } from '../../schemas/entities/postEntitySchema';
import { UserEntity } from '../../schemas/entities/userEntitySchema';
import { UserProfileEntity } from '../../schemas/entities/userProfileEntitySchema';
import { CommentEntity } from '../../schemas/entities/commentEntitySchema';

export type EnrichedPost = PostEntity & {
	user: Pick<UserEntity, 'username'> & Pick<UserProfileEntity, 'firstName' | 'lastName' | 'avatarUrl'>;
	commentsCount: number;
	likesCount: number;
	isLikedByCurrentUser: boolean;
};
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

	private buildIsLikedByCurrentUserExpression(currentUserId: number | undefined, postIdColumn: string) {
		return currentUserId !== undefined
			? this.knex.raw(`
				CASE
					WHEN EXISTS (
						SELECT 1 FROM post_likes
						WHERE post_likes.post_id = ${postIdColumn}
						AND post_likes.user_id = ?
					) THEN true
					ELSE false
				END as is_liked_by_current_user
			`, [currentUserId])
			: this.knex.raw(`false as is_liked_by_current_user`);
	}

	private buildIsLikedByCurrentUserAggregateExpression(currentUserId: number | undefined) {
		return currentUserId !== undefined
			? this.knex.raw(`
				CASE
					WHEN bool_or(post_likes.user_id = ?) THEN true
					ELSE false
				END as is_liked_by_current_user
			`, [currentUserId])
			: this.knex.raw(`false as is_liked_by_current_user`);
	}

	private buildPostsWithCommentsQuery(select: SelectColumns<PostEntity> = '*', currentUserId?: number) {
		const postColumns = this.buildPostColumnsSelect(select, 'posts');

		return this.knex
			.select(
				...postColumns,
				this.knex.raw(`
					JSON_BUILD_OBJECT(
						'username', users.username,
						'firstName', user_profiles.first_name,
						'lastName', user_profiles.last_name,
						'avatarUrl', user_profiles.avatar_url
					) as user
				`),
				this.knex.raw(`
					COALESCE(
						JSON_AGG(
							JSON_BUILD_OBJECT(
								'id', comments.id,
								'userId', comments.user_id,
								'postId', comments.post_id,
								'content', comments.content,
								'createdAt', comments.created_at,
								'updatedAt', comments.updated_at,
								'user', JSON_BUILD_OBJECT(
									'username', comment_users.username,
									'firstName', comment_profiles.first_name,
									'lastName', comment_profiles.last_name,
									'avatarUrl', comment_profiles.avatar_url
								)
							)
							ORDER BY comments.created_at DESC
						) FILTER (WHERE comments.id IS NOT NULL),
						'[]'
					) as comments
				`),
				this.knex.raw(`
					COUNT(comments.id)::int as comments_count
				`),
				this.knex.raw(`
					COUNT(DISTINCT post_likes.user_id)::int as likes_count
				`),
				this.buildIsLikedByCurrentUserAggregateExpression(currentUserId),
			)
			.from(this.tableName)
			.innerJoin('users', 'posts.user_id', 'users.id')
			.innerJoin('user_profiles', 'users.id', 'user_profiles.user_id')
			.leftJoin('comments', 'posts.id', 'comments.post_id')
			.leftJoin('users as comment_users', 'comments.user_id', 'comment_users.id')
			.leftJoin('user_profiles as comment_profiles', 'comment_users.id', 'comment_profiles.user_id')
			.leftJoin('post_likes', 'posts.id', 'post_likes.post_id')
			.groupBy(
				'posts.id',
				'users.username',
				'user_profiles.first_name',
				'user_profiles.last_name',
				'user_profiles.avatar_url'
			);
	}

	private query(select: SelectColumns<PostEntity> = '*', currentUserId?: number) {
		const postColumns = this.buildPostColumnsSelect(select, this.tableName);

		return this.qb
			.select(
				...postColumns,
				this.knex.raw(`
					JSON_BUILD_OBJECT(
						'username', users.username,
						'firstName', user_profiles.first_name,
						'lastName', user_profiles.last_name,
						'avatarUrl', user_profiles.avatar_url
					) as user
				`),
				this.knex.raw(`
					COALESCE(
						(SELECT COUNT(*)::int FROM comments WHERE comments.post_id = ${this.tableName}.id),
						0
					) as comments_count
				`),
				this.knex.raw(`
					COALESCE(
						(SELECT COUNT(*)::int FROM post_likes WHERE post_likes.post_id = ${this.tableName}.id),
						0
					) as likes_count
				`),
				this.buildIsLikedByCurrentUserExpression(currentUserId, `${this.tableName}.id`)
			)
			.from(this.tableName)
			.innerJoin('users', `${this.tableName}.userId`, 'users.id')
			.innerJoin('user_profiles', 'users.id', 'user_profiles.user_id');
	}

	async getById(
		id: number,
		includeComments = false,
		select: SelectColumns<PostEntity> = '*',
		currentUserId?: number
	): Promise<EnrichedPost | EnrichedPostWithComments | null> {
		if (!includeComments) {
			return this.query(select, currentUserId).where(`${this.tableName}.id`, id).first() ?? null;
		}

		return (await this.buildPostsWithCommentsQuery(select, currentUserId).where('posts.id', id).first()) ?? null;
	}

	async getAll(select: SelectColumns<PostEntity> = '*', currentUserId?: number): Promise<EnrichedPost[]> {
		return this.query(select, currentUserId).orderBy(`${this.tableName}.id`, 'desc');
	}

	async create(
		data: CreateEntity<PostEntity>,
		select: SelectColumns<PostEntity> = '*'
	): Promise<PostEntity & { username: string }> {
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

	async update(
		id: number,
		data: Partial<PostEntity>,
		select: SelectColumns<PostEntity> = '*'
	): Promise<PostEntity & { username: string }> {
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

	async getAllWithComments(select: SelectColumns<PostEntity> = '*', currentUserId?: number): Promise<EnrichedPostWithComments[]> {
		return this.buildPostsWithCommentsQuery(select, currentUserId).orderBy(`${this.tableName}.id`, 'desc');
	}

	async getAllUsersPosts(
		userId: number,
		includeComments = false,
		select: SelectColumns<PostEntity> = '*',
		currentUserId?: number
	): Promise<(PostEntity & { username: string }) | EnrichedPostWithComments[]> {
		if (includeComments) {
			return this.buildPostsWithCommentsQuery(select, currentUserId)
				.orderBy(`${this.tableName}.id`, 'desc')
				.where(`${this.tableName}.userId`, userId);
		}
		return this.query(select, currentUserId).where(`${this.tableName}.userId`, userId).orderBy(`${this.tableName}.id`, 'desc');
	}
}
