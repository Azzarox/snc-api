import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('posts', (table) => {
		table.increments('id').primary();
		table.string('title', 200).notNullable();
		table.text('content').notNullable();

		table.integer('user_id').unsigned().notNullable();
		table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('posts');
}
