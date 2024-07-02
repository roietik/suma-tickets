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
    } catch ({ message }) {
        const errorMessage = `Error updating value: ${message}`;
        console.error(errorMessage);
        response.status(500).send({ error: errorMessage });
    }
}
async function remove(request, response) {
    try {
        await valuesService.remove(request, response)
    } catch ({ message }) {
        const errorMessage = `Error updating value: ${message}`;
        console.error(errorMessage);
        response.status(500).send({ error: errorMessage });
    }
}

module.exports = {
    get,
    post,
    put,
    remove
};