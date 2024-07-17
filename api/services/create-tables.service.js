import adminConfig from "../config/admin.config.js";
import bcrypt from "bcryptjs";

async function createDefaultAdminUser(client) {
    const salt = await bcrypt.genSalt(10),
        hashedPassword = await bcrypt.hash(adminConfig.password, salt);

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
        const usersTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                email VARCHAR(255) UNIQUE
            )
        `;
        await client.query(usersTableQuery).then(() => console.log("Created table users"));

        const ticketsTableQuery = `
            CREATE TABLE IF NOT EXISTS tickets (
                id SERIAL PRIMARY KEY,
                base64 BYTEA,
                user_id INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `;
        await client.query(ticketsTableQuery).then(() => console.log("Created table tickets"));

        const ticketsLimitTableQuery = `
            CREATE TABLE IF NOT EXISTS tickets_limit (
                id SERIAL PRIMARY KEY,
                ticket_limit INT NOT NULL DEFAULT 2147483647
            )
        `;
        await client.query(ticketsLimitTableQuery).then(() => console.log("Created table tickets_limit"));

        const ticketsSoldOutTableQuery = `
            CREATE TABLE IF NOT EXISTS tickets_sold_out (
                id SERIAL PRIMARY KEY,
                tickets_sold_out BOOLEAN NOT NULL DEFAULT FALSE
            )
        `;
        await client.query(ticketsSoldOutTableQuery).then(() => console.log("Created table tickets_sold_out"));

        const employeesTableQuery = `
            CREATE TABLE IF NOT EXISTS employees (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255)
            )
        `;
        await client.query(employeesTableQuery).then( async () => {
            console.log("Created table employees");
            await createDefaultAdminUser(client);
        });

    } catch (err) {
        console.error("PG ERROR:", err);
    }
}

export default createTables;
