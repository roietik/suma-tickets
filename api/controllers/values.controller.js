const valuesService = require('../services/values.service');

async function get(request, response) {
    response.send(await valuesService.getAll());
}
async function post(request, response) {
    response.send(await valuesService.create(request, response));
}
async function put(request, response) {
    try {
       await valuesService.update(request, response);
    } catch (error) {
        console.error("Error updating value:", error);
        response.status(500).send({ error: "Error updating value" }); // User-friendly error message
    }
}
async function remove(request, response) {
    try {
        await valuesService.remove(request, response)
    } catch (error) {
        console.error("Error deleting value:", error);
        response.status(500).send({ error: "Error deleting value" }); // User-friendly error message
    }
}

module.exports = {
    get,
    post,
    put,
    remove
};