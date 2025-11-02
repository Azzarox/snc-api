import { Knex } from 'knex';
import {  KnexRepository, SelectColumns } from '../KnexRepository';
import { UserEntity } from '../../schemas/entities/userEntitySchema';
export class UserRepository extends KnexRepository<UserEntity> {
	protected tableName = 'users';

	constructor(knex: Knex) {
		super(knex);
	}

	async getByUsername(username: string, select: SelectColumns<UserEntity> = '*'): Promise<UserEntity | null> {
		return super.findOneBy({ username }, select)
	}
}
