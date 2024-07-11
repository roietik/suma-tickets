const employeesService = require('../services/employees.service');

async function getAll(request, response) {
    try {
        response.send(await employeesService.getAll());
    } catch ({ code, message }) {
        const errorMessage = `Błąd pracownika: ${message}`;
        console.error(errorMessage);
        response.status(500).send(errorMessage);
    }
}

async function token(request, response) {
    try {
        response.send(await employeesService.token(request, response));
    } catch ({ code, message }) {
        const errorMessage = `Błąd pobierania tokenu: ${message}`;
        console.error(errorMessage);
        response.status(500).send(errorMessage);
    }
}

async function logout(request, response) {
    try {
        response.send(await employeesService.logout(request, response));
    } catch ({ code, message }) {
        const errorMessage = `Błąd podczas wylogowywania: ${message}`;
        console.error(errorMessage);
        response.status(500).send(errorMessage);
    }
}

async function remove(request, response) {
    try {
        response.send(await employeesService.remove(request, response));
    } catch ({ message }) {
        const errorMessage = `Błąd pracownika ${message}`;
        console.error(errorMessage);
        response.status(500).send(errorMessage);
    }
}
async function registration(request, response) {
    try {
        response.send(await employeesService.registration(request, response));
    } catch ({ code, message }) {
        const errorMessage = `Błąd pracownika: ${message}`;
        console.error(errorMessage);
        return response.status(500).send(errorMessage);
    }
}

async function login(request, response) {
    try {
        response.send(await employeesService.login(request, response));
    } catch ({ code, message }) {
        const errorMessage = `Błąd pracownika: ${message}`;
        console.error(errorMessage);
        return response.status(500).send(errorMessage);
    }
}

module.exports = {
    getAll,
    registration,
    login,
    logout,
    token,
    remove
};