import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users_preferences", (table) => {
    table.dropColumn("vibe");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users_preferences", (table) => {
    table.text("vibe").notNullable();
  });
}
