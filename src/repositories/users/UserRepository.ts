import { Knex } from 'knex';
import { KnexRepository } from '../KnexRepository';

export class UserRepository extends KnexRepository<any> {
	protected tableName = 'users';

	constructor(knex: Knex) {
		super(knex);
	}
}
