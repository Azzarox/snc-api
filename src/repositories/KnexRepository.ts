import { Knex } from 'knex';

interface Writer<T> {
	create(item: CreateEntity<T>, returning?: ReturnColumns<T>, trx?: Knex.Transaction): Promise<T>;
	update(where: string | number | Partial<T>, item: Partial<T>, returning?: ReturnColumns<T>): Promise<T>;
	delete(id: string | number, returning?: ReturnColumns<T>): Promise<T>;
}

interface Reader<T> {
	find(item: Partial<T>): Promise<T[]>;
	findById(id: string | number, select?: SelectColumns<T>): Promise<T | null>;
	findOneBy(item: Partial<T>, select?: SelectColumns<T>): Promise<T | null>;
	getAll(): Promise<T[]>;
}

type BaseRepository<T> = Writer<T> & Reader<T>;

type StringKeyOf<T> = Extract<keyof T, string>;
type ReturnColumns<T> = StringKeyOf<T> | Array<StringKeyOf<T>> | '*';
type SelectColumns<T> = ReturnColumns<T>;

type CreateEntity<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export abstract class KnexRepository<T> implements BaseRepository<T> {
	protected abstract tableName: string;

	constructor(protected knex: Knex) { }

	public get qb(): Knex.QueryBuilder {
		return this.knex(this.tableName);
	}

	protected getQueryBuilder(trx?: Knex.Transaction): Knex.QueryBuilder {
		return trx ? trx(this.tableName) : this.knex(this.tableName);
	}

	async create(data: CreateEntity<T>, returning: ReturnColumns<T> = '*', trx?: Knex.Transaction): Promise<T> {
		return this.getQueryBuilder(trx)
			.insert(data)
			.returning(returning)
			.then((rows) => rows[0]);
	}

	async update(where: string | number | Partial<T>, item: Partial<T>, returning: ReturnColumns<T> = '*'): Promise<T> {
		const whereClause = typeof where === 'object' ? where : { id: where };
		return this.qb
			.where(whereClause)
			.update({
				...item,
				updatedAt: new Date(),
			})
			.returning(returning)
			.then((rows) => rows[0]);
	}

	async delete(where: string | number | Partial<T>, returning: ReturnColumns<T> = '*'): Promise<T> {
		const whereClause = typeof where === 'object' ? where : { id: where };

		return this.qb
			.where(whereClause)
			.delete()
			.returning(returning)
			.then((rows) => rows[0]);
	}

	find(item: Partial<T>, select: SelectColumns<T> = '*'): Promise<T[]> {
		return this.qb.select('*').returning(select).where({ ...item });
	}

	findById(id: string | number, select: SelectColumns<T> = '*'): Promise<T | null> {
		return this.qb.select(select).where({ id }).first() ?? null;
	}

	findOneBy(item: Partial<T>, select: SelectColumns<T> = '*'): Promise<T | null> {
		return this.qb.select(select).where(item).first() ?? null;
	}

	async getAll(select: SelectColumns<T> = '*'): Promise<T[]> {
		return this.qb
			.select(select)
			.from(this.tableName)
			.then((rows) => rows);
	}
}

export type { CreateEntity, ReturnColumns, SelectColumns };
