import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('user_profiles', (table) => {
		table.text('avatar_url').nullable();
		table.text('avatar_storage_key').nullable();
		table.text('cover_url').nullable();
		table.text('cover_storage_key').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('user_profiles', (table) => {
		table.dropColumn('avatar_url');
		table.dropColumn('avatar_storage_key');
		table.dropColumn('cover_url');
		table.dropColumn('cover_storage_key');
	});
}
