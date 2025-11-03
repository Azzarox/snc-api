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
		select: SelectColumns<UserProfileEntity> = ['first_name', 'last_name']
	): Promise<(UserProfileEntity & { email: string }) | null> {
		const result = await super.qb
			.select(select)
			.select('users.email')
			.leftJoin('users', `${this.tableName}.user_id`, 'users.id')
			.where({ [`${this.tableName}.user_id`]: userId })
			.first();

		return result || null;
	}
}
