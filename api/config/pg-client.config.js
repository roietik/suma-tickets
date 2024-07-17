import pkg from "pg";
const { Pool } = pkg;
import dbConfig from "./db.config.js";

const pgClient = new Pool({
    host: dbConfig.pgHost,
    port: dbConfig.pgPort,
    database: dbConfig.pgDatabase,
    user: dbConfig.pgUser,
    password: dbConfig.pgPassword
});

export default pgClient;
