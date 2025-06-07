import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.transaction(async (trx) => {
    // Rename columns
    await trx.schema.alterTable("playlists", table => {
      table.renameColumn("context", "description");
      table.renameColumn("creationTime", "creationDate");
      table.renameColumn("lastUpdateTime", "lastUpdatedDate");
    });
    
    // Add spotifyPlaylistId column
    await trx.schema.alterTable("playlists", table => {
      table.string("spotifyPlaylistId");
    });
    
    // Convert name from text[] to text
    await trx.raw(`
      -- Create a temporary column with the new type
      ALTER TABLE playlists ADD COLUMN name_new TEXT;
      
      -- Update the new column with values from the old one
      -- For text[] to text conversion, we'll take the first element or empty string
      UPDATE playlists SET name_new = COALESCE(name[1], '');
      
      -- Make the new column NOT NULL
      ALTER TABLE playlists ALTER COLUMN name_new SET NOT NULL;
      
      -- Drop the old column
      ALTER TABLE playlists DROP COLUMN name;
      
      -- Rename the new column to the original name
      ALTER TABLE playlists RENAME COLUMN name_new TO name;
    `);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.transaction(async (trx) => {
    // Revert column renames
    await trx.schema.alterTable("playlists", table => {
      table.renameColumn("description", "context");
      table.renameColumn("creationDate", "creationTime");
      table.renameColumn("lastUpdatedDate", "lastUpdateTime");
    });
    
    // Drop spotifyPlaylistId column
    await trx.schema.alterTable("playlists", table => {
      table.dropColumn("spotifyPlaylistId");
    });
    
    // Note: We're not attempting to convert name back to text[] as it would be complex
    // and potentially data-losing
  });
}
