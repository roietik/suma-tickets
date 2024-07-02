const usersService = require('../services/users.service');

async function get(request, response) {
    try {
        response.send(await usersService.getAll());
    } catch ({ code, message }) {
        const errorMessage = `Error fetching users: ${message}`;
        console.error(errorMessage);
        response.status(500).send({error: errorMessage});
    }
}

async function post(request, response) {
    try {
        response.send(await usersService.create(request, response));
    } catch ({ code, message }) {
        if (code === '23505') { // Check for unique email
            response.status(400).send({error: "Email already exists"});
            return;
        }
        const errorMessage = `Error fetching users: ${message}`;
        console.error(errorMessage);
        return response.status(500).send({ error: errorMessage });
    }
}

async function remove(request, response) {
    try {
        await usersService.remove(request, response)
    } catch ({ message }) {
        const errorMessage = `Error updating user: ${message}`;
        console.error(errorMessage);
        response.status(500).send({ error: errorMessage });
    }
}

module.exports = {
    get,
    post,
    remove
};