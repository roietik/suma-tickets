import usersService from "../services/users.service.js";
import models from '../models/models.js';
import UsersService from "../services/users.service.js";
const UserModel = models.users;

const findAll = (request, response) => {
    const { page, size, first_name, last_name, email } = request.query,
        condition = {
            ...UsersService.buildSearchCondition({first_name}),
            ...UsersService.buildSearchCondition({last_name}),
            ...UsersService.buildSearchCondition({email}),
        },
        { limit, offset } = UsersService.getPagination(page, size);

    UserModel.findAndCountAll({ where: condition, limit, offset })
        .then(data => response.send(UsersService.getPagingData(data, page, limit)))
        .catch((error) => {
            response.status(500).send({ message: error.message
                    || "Some error occurred while retrieving tutorials."
            });
        });
};

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
    findAll,
    post,
    remove,
    isEmailExists
};
