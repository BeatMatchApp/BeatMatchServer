import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").primary();
      table.text("email").primary();
      table.text("name").notNullable();
      table.date("birthDate");
      table.text("password").notNullable();
      table.text("country");
      table
        .timestamp("creationTime", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
    })
    .createTable("users_preferences", (table) => {
      table.uuid("userId").primary();
      table.specificType("artists", "text[]").notNullable();
      table.specificType("genres", "text[]").notNullable();
      table.text("song");
      table.text("vibe").notNullable();

      table
        .foreign("userId")
        .references("users.id")
        .onUpdate("NO ACTION")
        .onDelete("NO ACTION");
    })
    .createTable("playlists", (table) => {
      table.uuid("id").primary();
      table.uuid("userId").notNullable();
      table.specificType("name", "text[]").notNullable();
      table.text("context").notNullable();
      table.specificType("songs", "text[]");
      table
        .timestamp("lastUpdateTime", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
      table
        .timestamp("creationTime", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());

      table
        .foreign("userId")
        .references("users.id")
        .onUpdate("NO ACTION")
        .onDelete("NO ACTION");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("playlists")
    .dropTableIfExists("users_preferences")
    .dropTableIfExists("users");
}
