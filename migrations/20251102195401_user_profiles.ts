import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('user_profiles', (table) => {
		table.increments('id').primary();
		table.integer('user_id').unsigned().notNullable().unique();
		table.foreign('user_id').references('users.id').onDelete('CASCADE');

		table.string('first_name').notNullable();
		table.string('last_name').notNullable();
		table.string('bio', 120).nullable();
		table.string('description', 255).nullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('user_profiles');
}
