import pgClient from "../configs/pg-client.config.js";
import models from "../models/models.js";
const Op = models.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : Number.MAX_SAFE_INTEGER,
        offset = page ? page * limit : 0;

    return { limit, offset };
};
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data,
        currentPage = page ? +page : 0,
        totalPages = Math.ceil(totalItems / limit),
        collection = users.map(user => ({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email
        }));

    return { totalItems, collection, totalPages, currentPage };
};

const buildSearchCondition = (fieldObj) => {
    const entries = Object.entries(fieldObj),
        [key, value] = entries[0];

    if (!value) return {};
    return { [key]: { [Op.like]: `%${value}%` } };
};
async function findAll() {
    const users = await pgClient.query("SELECT * FROM users");
    return users.rows.map(user => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
    }));
}
async function getAll() {
    const users = await pgClient.query("SELECT * FROM users");
    return users.rows.map(user => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
    }));
}

async function create(request, response){
    const { firstName, lastName, email, ticketBase64 } = request.body;
    if (!firstName || !lastName || !email || !ticketBase64) {
        throw new Error("Missing required user data");
    }

    const userResult = await createUser(firstName, lastName, email);
    if (userResult.rowCount === 0) {
        throw new Error("Error creating user");
    }

    const user = await getCurrentUser();

    const ticketResult = await createTicket(user.id, ticketBase64);
    if (ticketResult.rowCount === 0) {
        throw new Error("Error saving ticket");  // Handle ticket saving errors
    }
    return user;
}

async function createUser(firstName, lastName, email) {
    const emailExists = await pgClient.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailExists.rows.length > 0) {
        throw new Error("Na ten adres email bilet został już wygenerowany");
    }

    const userResult = await pgClient.query(
        "INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3)",
        [firstName, lastName, email]
    );

    return userResult;
}
async function getCurrentUser() {
    const usersResult = await pgClient.query("SELECT * FROM users");
    const currentUser = usersResult.rows[usersResult.rows.length - 1]
    return {
        id: currentUser.id,
        email: currentUser.email,
        firstName: currentUser.first_name,
        lastName: currentUser.last_name
    };
}

async function createTicket(userId, ticketBase64) {
    return await pgClient.query(
        "INSERT INTO tickets (user_id, base64) VALUES ($1, $2)",
        [userId, ticketBase64]
    );
}

async function remove(request, response) {
    const userId = request.params.id;
    if (!userId) {
        throw new Error("Missing user ID in request parameter");
    }

    const userResult = await pgClient.query("DELETE FROM users WHERE id = $1", [userId]);
    if (userResult.rowCount === 0) {
        response.status(404).send("User not found");
        return;
    }

    const ticketResult = await pgClient.query("DELETE FROM tickets WHERE user_id = $1", [userId]);
    if (ticketResult.rowCount === 0) {
        response.status(404).send("Ticket not found");
        return;
    }

    const users = await pgClient.query("SELECT * FROM users");
    return users.rows;
}

async function isEmailExists(email) {
    if (!email) {
        throw new Error("Missing required email");
    }

    const result = await pgClient.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
        throw new Error("Na ten adres email bilet został już wygenerowany");
    }
    return result.rows.length > 0;
}

export default {
    getAll,
    create,
    remove,
    isEmailExists,
    getPagingData,
    getPagination,
    buildSearchCondition
};
