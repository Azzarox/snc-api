import { Knex } from 'knex';
import { KnexRepository, SelectColumns } from '../KnexRepository';
import { UserProfileEntity } from '../../schemas/entities/userProfileEntitySchema';

export type EnrichedUserProfile = UserProfileEntity & {
	username: string;
};

export class UserProfileRepository extends KnexRepository<UserProfileEntity> {
	protected tableName = 'user_profiles';

	constructor(knex: Knex) {
		super(knex);
	}

	private buildProfileColumnsSelect(select: SelectColumns<UserProfileEntity>): string[] {
		const profileColumns =
			select === '*'
				? [`${this.tableName}.*`]
				: Array.isArray(select)
					? select.map((col) => `${this.tableName}.${String(col)}`)
					: [`${this.tableName}.${select}`];

		return profileColumns;
	}

	async getUserProfile(
		userId: number,
		select: SelectColumns<UserProfileEntity> = [
			'firstName',
			'lastName',
			'description',
			'bio',
			'userId',
			'avatarUrl',
			'coverUrl',
			'createdAt',
		]
	): Promise<EnrichedUserProfile | null> {
		const profileColumns = this.buildProfileColumnsSelect(select);

		const result = await this.knex
			.select(...profileColumns, 'users.username')
			.from(this.tableName)
			.innerJoin('users', `${this.tableName}.userId`, 'users.id')
			.where(`${this.tableName}.userId`, userId)
			.first();

		return result || null;
	}
}
