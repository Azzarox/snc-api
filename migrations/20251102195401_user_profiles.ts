import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
   return knex.schema.createTable('user_profiles', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().unique();
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        
        table.string('first_name');
        table.string('last_name');
        
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('user_profiles');
}