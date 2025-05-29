import { knex } from "knex";

const env = process.env.NODE_ENV || "development";
const dbConfig = require("../config/db");
const dataAccess = knex(dbConfig[env]);

export { dataAccess };
