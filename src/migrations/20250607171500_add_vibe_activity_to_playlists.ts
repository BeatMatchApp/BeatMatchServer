import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("playlists", table => {
    table.string("vibe").notNullable().defaultTo("");
    table.string("activity").notNullable().defaultTo("");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("playlists", table => {
    table.dropColumn("activity");
    table.dropColumn("vibe");
  });
}
