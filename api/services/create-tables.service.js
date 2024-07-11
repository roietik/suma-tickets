const pgClient = require("../config/pg-client.config");

function createTables(client) {
    try {
        client.query("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255))");
        console.log("Created table users");
        client.query("CREATE TABLE IF NOT EXISTS tickets (id SERIAL PRIMARY KEY, base64 BYTEA, user_id INT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id))");
        console.log("Created table tickets");
        client.query("CREATE TABLE IF NOT EXISTS tickets_limit (id SERIAL PRIMARY KEY, ticket_limit INT NOT NULL DEFAULT 2147483647)");
        console.log("Created table tickets_limit");
        client.query("CREATE TABLE IF NOT EXISTS tickets_sold_out (id SERIAL PRIMARY KEY, tickets_sold_out BOOLEAN NOT NULL DEFAULT FALSE)");
        console.log("Created table tickets_sold_out");

    } catch (err) {
        console.error("PG ERROR:", err);
    }
}

module.exports = createTables;