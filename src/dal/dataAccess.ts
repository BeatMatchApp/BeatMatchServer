import { knex } from "knex";

const env = process.env.NODE_ENV || "development";
const config = require("../config/db");
const dataAccess = knex(config[env]);

export { dataAccess };
