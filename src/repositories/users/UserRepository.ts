import { Knex } from 'knex';
import { KnexRepository, SelectColumns } from '../KnexRepository';
import { UserEntity } from '../../schemas/entities/userEntitySchema';
export class UserRepository extends KnexRepository<UserEntity> {
	protected tableName = 'users';

	constructor(knex: Knex) {
		super(knex);
	}

	async getByUsername(
		username: string,
		select: SelectColumns<UserEntity> = ['id', 'username', 'created_at', 'updated_at']
	): Promise<UserEntity | null> {
		return super.findOneBy({ username }, select);
	}

	async getByEmail(
		email: string,
		select: SelectColumns<UserEntity> = ['id', 'username', 'created_at', 'updated_at']
	): Promise<UserEntity | null> {
		return super.findOneBy({ email }, select);
	}
}
