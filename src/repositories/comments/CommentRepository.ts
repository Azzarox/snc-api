import { CommentEntity } from '../../schemas/entities/commentEntitySchema';
import { KnexRepository } from '../KnexRepository';
import { UserEntity } from '../../schemas/entities/userEntitySchema';
import { UserProfileEntity } from '../../schemas/entities/userProfileEntitySchema';

export type EnrichedComment = CommentEntity & {
	user: Pick<UserEntity, 'username'> & Pick<UserProfileEntity, 'firstName' | 'lastName' | 'avatarUrl'>;
};

export class CommentRepository extends KnexRepository<CommentEntity> {
	protected tableName = 'comments';

	async getPostComments(postId: number): Promise<EnrichedComment[]> {
		return this.knex
			.select(
				`${this.tableName}.*`,
				this.knex.raw(`
					JSON_BUILD_OBJECT(
						'username', users.username,
						'firstName', user_profiles.first_name,
						'lastName', user_profiles.last_name,
						'avatarUrl', user_profiles.avatar_url
					) as user
				`)
			)
			.from(this.tableName)
			.innerJoin('users', `${this.tableName}.userId`, 'users.id')
			.innerJoin('user_profiles', 'users.id', 'user_profiles.user_id')
			.where(`${this.tableName}.postId`, postId)
			.orderBy(`${this.tableName}.createdAt`, 'desc');
	}
}
