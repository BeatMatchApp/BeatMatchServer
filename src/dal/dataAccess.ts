import { knex } from "knex";

const config = require("../config/db");
const dataAccess = knex(config);

export { dataAccess };
