import { Knex } from 'knex';
import { db } from '../../config/knexConfig';

export async function withTransaction<T>(callback: (trx: Knex.Transaction) => Promise<T>): Promise<T> {
	return await db.transaction(callback);
}
