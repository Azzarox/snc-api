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
		select: SelectColumns<UserProfileEntity> = ['id', 'user_id', 'first_name', 'last_name']
	): Promise<UserProfileEntity | null> {
		return super.findOneBy({ user_id: userId }, select);
	}
}
