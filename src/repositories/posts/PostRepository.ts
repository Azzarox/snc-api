import { CreateEntity, KnexRepository, SelectColumns } from '../KnexRepository';
import { PostEntity } from '../../schemas/entities/postEntitySchema';
import { UserEntity } from '../../schemas/entities/userEntitySchema';

export type EnrichedPost = PostEntity & Pick<UserEntity, 'username'>;

export class PostRepository extends KnexRepository<PostEntity> {
	protected tableName = 'posts';

	private buildEnrichedSelect(select: SelectColumns<PostEntity>, sourceTable: string): string[] {
		const postColumns =
			select === '*'
				? `${sourceTable}.*`
				: Array.isArray(select)
					? select.map((col) => `${sourceTable}.${String(col)}`)
					: `${sourceTable}.${select}`;

		return Array.isArray(postColumns) ? [...postColumns, 'users.username'] : [postColumns, 'users.username'];
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
		const selectColumns = this.buildEnrichedSelect(select, 'inserted_post');

		const enrichedPost = await this.knex
			.with('inserted_post', (qb) => {
				qb.insert(data).into(this.tableName).returning('*');
			})
			.select(selectColumns)
			.from('inserted_post')
			.innerJoin('users', 'inserted_post.userId', 'users.id')
			.first();

		if (!enrichedPost) {
			throw new Error('Failed to create post');
		}

		return enrichedPost;
	}

	async update(id: number, data: Partial<PostEntity>, select: SelectColumns<PostEntity> = '*'): Promise<EnrichedPost> {
		const selectColumns = this.buildEnrichedSelect(select, 'updated_post');

		const enrichedPost = await this.knex
			.with('updated_post', (qb) => {
				qb.update(data).from(this.tableName).where('id', id).returning('*');
			})
			.select(selectColumns)
			.from('updated_post')
			.innerJoin('users', 'updated_post.userId', 'users.id')
			.first();

		if (!enrichedPost) {
			throw new Error(`Failed to update post with id ${id}`);
		}

		return enrichedPost;
	}
}
