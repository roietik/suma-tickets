const {Pool} = require("pg");
const dbConfig = require("./db.config");

const pgClient = new Pool({
    host: dbConfig.pgHost,
    port: dbConfig.pgPort,
    database: dbConfig.pgDatabase,
    user: dbConfig.pgUser,
    password: dbConfig.pgPassword
});

module.exports = pgClient