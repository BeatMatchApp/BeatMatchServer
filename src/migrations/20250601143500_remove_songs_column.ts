import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("playlists", table => {
    // Drop the songs column as we're now fetching songs directly from Spotify
    table.dropColumn("songs");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("playlists", table => {
    // Add the songs column back with its original type
    table.specificType("songs", "text[]");
  });
}
