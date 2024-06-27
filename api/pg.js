const { Pool } = require("pg");
const keys = require("./keys");

const pg = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pg.on("connect", client => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (id SERIAL PRIMARY KEY, value INT)")
        .then(() => client.query("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, firstName VARCHAR(255), lastName VARCHAR(255), email VARCHAR(255) UNIQUE NOT NULL, ticket_id INT NOT NULL)"))
        .catch(err => console.log("PG ERROR", err));
});

module.exports = pg;