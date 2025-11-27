import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('post_likes', (table) => {
		table.integer('user_id').unsigned().notNullable();
		table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

		table.integer('post_id').unsigned().notNullable();
		table.foreign('post_id').references('id').inTable('posts').onDelete('CASCADE');

		table.primary(['user_id', 'post_id']);

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('post_likes');
}
