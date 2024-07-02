const pgClient = require("./database.service");
const {response} = require("express");

async function hasDummyUsersBeenInserted() {
    const result = await pgClient.query("SELECT COUNT(*) FROM users WHERE email LIKE '%@example.com'");
    const dummyUserCount = result.rows[0].count;
    return dummyUserCount > 0;
}

async function getAll(){
    if (!await hasDummyUsersBeenInserted()) {
        const dummyUsers = [
            {firstName: "John", lastName: "Doe", email: "johndoe@example.com"},
            {firstName: "Jane", lastName: "Smith", email: "janesmith@example.com"},
            {firstName: "Peter", lastName: "Jones", email: "peterjones@example.com"},
            {firstName: "Mary", lastName: "Brown", email: "marybrown@example.com"},
            {firstName: "David", lastName: "Williams", email: "davidwilliams@example.com"},
        ];

        for (const user of dummyUsers) {
            await pgClient.query("INSERT INTO users(firstName, lastName, email) VALUES ($1, $2, $3)", [user.firstName, user.lastName, user.email]);
        }
    }

    const users = await pgClient.query("SELECT * FROM users");
    return users.rows;
}

async function createUser(firstName, lastName, email) {
    const emailExists = await pgClient.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailExists.rows.length > 0) {
        throw new Error("Email already exists");
    }

    const userResult = await pgClient.query(
        "INSERT INTO users (firstName, lastName, email) VALUES ($1, $2, $3)",
        [firstName, lastName, email]
    );

    return userResult;
}

async function getCurrentUser() {
    const usersResult = await pgClient.query("SELECT * FROM users");
    return usersResult.rows[usersResult.rows.length - 1];
}

async function createTicket(userId, ticketBase64) {
    return await pgClient.query(
        "INSERT INTO tickets (user_id, base64) VALUES ($1, $2)",
        [userId, ticketBase64]
    );
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

    // await sendEmail();

    return user;
}

async function remove(request, response) {
    const userId = request.params.id;
    if (!userId) {
        throw new Error("Missing user ID in request parameter");
    }

    const userResult = await pgClient.query("DELETE FROM users WHERE id = $1", [userId]);
    if (userResult.rowCount === 0) {
        response.status(404).send({ error: "User not found" });
        return;
    }

    const ticketResult = await pgClient.query("DELETE FROM tickets WHERE user_id = $1", [userId]);
    if (ticketResult.rowCount === 0) {
        response.status(404).send({ error: "Ticket not found" });
        return;
    }

    const users = await pgClient.query("SELECT * FROM users");
    response.send(users.rows);
}

module.exports = {
    getAll,
    create,
    remove
}