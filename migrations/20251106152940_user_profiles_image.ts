import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('user_profiles', (table) => {
		table.string('avatar_url').nullable();
		table.string('avatar_storage_key').nullable();
		table.string('cover_url').nullable();
		table.string('cover_storage_key').nullable();
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
