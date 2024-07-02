const { Pool } = require("pg");
const keys= require("./keys.service");

const databaseService = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

databaseService.on("connect", client => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (id SERIAL PRIMARY KEY, value INT)")
        .then(() => client.query(
            "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, firstName VARCHAR(255), lastName VARCHAR(255), email VARCHAR(255))")
        )
        .then(() => client.query(
            "CREATE TABLE IF NOT EXISTS tickets (id SERIAL PRIMARY KEY, base64 VARCHAR(255), user_id INT NOT NULL)")
        )
        .catch(err => console.log("PG ERROR", err));
});

module.exports = databaseService;