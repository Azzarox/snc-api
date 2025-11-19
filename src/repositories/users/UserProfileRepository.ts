import { Knex } from 'knex';
import { KnexRepository, SelectColumns } from '../KnexRepository';
import { UserProfileEntity } from '../../schemas/entities/userProfileEntitySchema';

export class UserProfileRepository extends KnexRepository<UserProfileEntity> {
	protected tableName = 'user_profiles';

	constructor(knex: Knex) {
		super(knex);
	}

	async getUserProfile(
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
		| null
	> {
		const result = await super.qb
			.select(select)
			.where({ [`${this.tableName}.userId`]: userId })
			.first();

		return result || null;
	}
}
