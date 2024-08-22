import usersService from "../services/users.service.js";
import models from '../models/models.js';
const User = models.users;
const Op = models.Sequelize.Op;

const _getPagination = (page, size) => {
    const limit = size ? +size : Number.MAX_SAFE_INTEGER,
        offset = page ? page * limit : 0;

    return { limit, offset };
};

const _getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data,
        currentPage = page ? +page : 0,
        totalPages = Math.ceil(totalItems / limit);

    return { totalItems, users, totalPages, currentPage };
};

const _buildSearchCondition = (fieldObj) => {
    const entries = Object.entries(fieldObj),
        [key, value] = entries[0];

    if (!value) return {};
    return { [key]: { [Op.like]: `%${value}%` } };
};

const findAll = (request, response) => {
    const { page, size, first_name, last_name, email } = request.query,
        condition = {
            ..._buildSearchCondition({first_name}),
            ..._buildSearchCondition({last_name}),
            ..._buildSearchCondition({email}),
        },
        { limit, offset } = _getPagination(page, size);

    User.findAndCountAll({ where: condition, limit, offset })
        .then(data => {
            const _response = _getPagingData(data, page, limit);
            response.send(_response);
        })
        .catch(err => {
            response.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
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
