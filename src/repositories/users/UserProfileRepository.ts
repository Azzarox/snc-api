import { Knex } from 'knex';
import { KnexRepository, SelectColumns } from '../KnexRepository';
import { UserProfileEntity } from '../../schemas/entities/userProfileEntitySchema';

export class UserProfileRepository extends KnexRepository<UserProfileEntity> {
	protected tableName = 'user_profiles';

	constructor(knex: Knex) {
		super(knex);
	}

	async getCurrentUserProfile(
		userId: number,
		select: SelectColumns<UserProfileEntity> = [
			'firstName',
			'lastName',
			'description',
			'bio',
			'avatarUrl',
			'coverUrl',
			'createdAt',
		]
	): Promise<
		| UserProfileEntity
		// & { email: string }
		| null
	> {
		const result = await super.qb
			.select(select)
			// .select('users.email', 'users.username')
			// .innerJoin('users', `${this.tableName}.userId`, 'users.id')
			.where({ [`${this.tableName}.userId`]: userId })
			.first();

		return result || null;
	}
}
