const keys = require("./keys");

// Express Application setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require("pg");
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on("connect", client => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch(err => console.log("PG ERROR", err));
});

//Express route definitions
app.get("/", (req, res) => {
    res.send("API");
});

// get the values
app.get("/values", async (req, res) => {
    const values = await pgClient.query("SELECT * FROM values");
    const result = values.rows;
    res.send(result);
});

// now the post -> insert value
app.post("/values", async (req, res) => {
    if (!req.body.value) res.send({ working: false });

    pgClient.query("INSERT INTO values(value) VALUES($1)", [req.body.value]);

    const values = await pgClient.query("SELECT * FROM values");
    const result = values.rows;

    res.send(result);
});

app.put("/values/:id", async (req, res) => {
    try {
        const valueId = req.params.id; // Get value ID from request parameter
        const newValue = req.body.value; // Get new value from request body

        if (!valueId || !newValue) {
            throw new Error("Missing value ID or new value in request");
        }

        const result = await pgClient.query(
            "UPDATE values SET number = $1 WHERE id = $2",
            [newValue, valueId]
        );

        if (result.rowCount === 0) {
            res.status(404).send({ error: "Value not found" }); // Value not found
        } else {
            res.send({ message: "Value updated successfully" });
        }
    } catch (err) {
        console.error("Error updating value:", err);
        res.status(500).send({ error: "Error updating value" }); // User-friendly error message
    }
});

app.delete("/values/:id", async (req, res) => {
    try {
        const valueId = req.params.id; // Get value ID from request parameter

        if (!valueId) {
            throw new Error("Missing value ID in request parameter");
        }

        const result = await pgClient.query("DELETE FROM values WHERE id = $1", [valueId]);

        if (result.rowCount === 0) {
            res.status(404).send({ error: "Value not found" }); // Value not found
        } else {
            const values = await pgClient.query("SELECT * FROM values");
            const result = values.rows;
            res.send(result);
        }
    } catch (err) {
        console.error("Error deleting value:", err);
        res.status(500).send({ error: "Error deleting value" }); // User-friendly error message
    }
});

app.listen(5050, err => {
    console.log("Listening");
});