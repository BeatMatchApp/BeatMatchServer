module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "qwe123",
      database: "beat_match",
    },
    migrations: {
      directory: __dirname + "/../migrations",
      extension: "ts",
    },
  },
  production: {
    client: "pg",
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: __dirname + "/../migrations",
      extension: "ts",
    },
  },
};
