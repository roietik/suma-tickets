import usersService from "../services/users.service.js";

async function getAll(request, response) {
    try {
        response.send(await usersService.getAll());
    } catch ({ code, message }) {
        const errorMessage = `Błąd użytkowników: ${message}`;
        console.error(errorMessage);
        response.status(500).send(errorMessage);
    }
}

async function post(request, response) {
    try {
        response.send(await usersService.create(request, response));
    } catch ({ code, message }) {
        const errorMessage = `Błąd użytkownika: ${message}`;
        console.error(errorMessage);
        return response.status(500).send(errorMessage);
    }
}

async function remove(request, response) {
    try {
        response.send(await usersService.remove(request, response));
    } catch ({ message }) {
        const errorMessage = `Błąd użytkownika ${message}`;
        console.error(errorMessage);
        response.status(500).send(errorMessage);
    }
}

async function isEmailExists(request, response) {
    try {
        response.send(await usersService.isEmailExists(request.body.email));
    } catch ({ code, message }) {
        const errorMessage = `Błąd użytkownika: ${message}`;
        console.error(errorMessage);
        return response.status(500).send(errorMessage);
    }
}

export default {
    getAll,
    post,
    remove,
    isEmailExists
};
