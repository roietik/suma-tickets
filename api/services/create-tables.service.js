import adminConfig from "../config/admin.config.js";
import bcrypt from "bcryptjs";

async function createDefaultAdminUser(client) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminConfig.password, salt);

    client.query("SELECT 1 FROM employees LIMIT 1")
        .then((result) => {
            if (result.rowCount === 0) {
                client.query(
                    "INSERT INTO employees (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
                    [adminConfig.firstName, adminConfig.lastName, adminConfig.email, hashedPassword]
                )
                    .then(() => console.log("Created default admin user"))
                    .catch((err) => console.error("Error creating admin user:", err));
            } else {
                console.log("Admin user already exists, skipping creation.");
            }
        })
        .catch((err) => console.error("Error checking for admin user:", err));
}

async function createTables(client) {
    try {
        await client.query("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255))").then(() => {
            console.log("Created table users");
        });

        await client.query("CREATE TABLE IF NOT EXISTS tickets (id SERIAL PRIMARY KEY, base64 BYTEA, user_id INT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id))").then(() => {
            console.log("Created table tickets");
        });

        await client.query("CREATE TABLE IF NOT EXISTS tickets_limit (id SERIAL PRIMARY KEY, ticket_limit INT NOT NULL DEFAULT 2147483647)").then(() => {
            console.log("Created table tickets_limit");
        });

        await client.query("CREATE TABLE IF NOT EXISTS tickets_sold_out (id SERIAL PRIMARY KEY, tickets_sold_out BOOLEAN NOT NULL DEFAULT FALSE)").then(() => {
            console.log("Created table tickets_sold_out");
        });

        await client.query("CREATE TABLE IF NOT EXISTS employees (id SERIAL PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))").then( async () => {
            console.log("Created table employees");
            await createDefaultAdminUser(client);
        });

    } catch (err) {
        console.error("PG ERROR:", err);
    }
}

export default createTables;
