const pgClient = require("../pg");

async function getAll() {
    const values = await pgClient.query("SELECT * FROM values");
    return  values.rows;
}

async function create(request, response) {
    if (!request.body.value) response.send({ working: false });

    pgClient.query("INSERT INTO values(value) VALUES($1)", [request.body.value]);

    const values = await pgClient.query("SELECT * FROM values");
    return values.rows;
}

async function update(request, response) {
    const valueId = request.params.id; // Get value ID from request parameter
    const newValue = request.body.value; // Get new value from request body

    if (!valueId || !newValue) {
        throw new Error("Missing value ID or new value in request");
    }

    const result = await pgClient.query(
        "UPDATE values SET number = $1 WHERE id = $2",
        [newValue, valueId]
    );

    if (result.rowCount === 0) {
        response.status(404).send({ error: "Value not found" }); // Value not found
    } else {
        response.send({ message: "Value updated successfully" });
    }
}

async function remove(request, response) {
    const valueId = request.params.id; // Get value ID from request parameter

    if (!valueId) {
        throw new Error("Missing value ID in request parameter");
    }

    const result = await pgClient.query("DELETE FROM values WHERE id = $1", [valueId]);

    if (result.rowCount === 0) {
        response.status(404).send({ error: "Value not found" }); // Value not found
    } else {
        const values = await pgClient.query("SELECT * FROM values");
        const result = values.rows;
        response.send(result);
    }
}

module.exports = {
    getAll,
    create,
    update,
    remove
}