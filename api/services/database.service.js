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
    try {
        client.query("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, firstName VARCHAR(255), lastName VARCHAR(255), email VARCHAR(255))");
        console.log("Created table users");

        client.query("CREATE TABLE IF NOT EXISTS tickets (id SERIAL PRIMARY KEY, base64 BYTEA, user_id INT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id))");
        console.log("Created table tickets");
    } catch (err) {
        console.error("PG ERROR:", err);
    }
});

module.exports = databaseService;