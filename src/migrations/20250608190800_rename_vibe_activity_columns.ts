import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("playlists", table => {
    table.renameColumn("vibe", "mood");
    table.renameColumn("activity", "event");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("playlists", table => {
    table.renameColumn("mood", "vibe");
    table.renameColumn("event", "activity");
  });
}
