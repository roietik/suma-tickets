const pgClient = require("../pg");

async function hasDummyUsersBeenInserted() {
    const result = await pgClient.query("SELECT COUNT(*) FROM users WHERE email LIKE '%@example.com'");
    const dummyUserCount = result.rows[0].count;
    return dummyUserCount > 0;
}

const dummyUsers = [
    {firstName: "John", lastName: "Doe", email: "johndoe@example.com", ticket_id: 123},
    {firstName: "Jane", lastName: "Smith", email: "janesmith@example.com", ticket_id: 456},
    {firstName: "Peter", lastName: "Jones", email: "peterjones@example.com", ticket_id: 789},
    {firstName: "Mary", lastName: "Brown", email: "marybrown@example.com", ticket_id: 1011},
    {firstName: "David", lastName: "Williams", email: "davidwilliams@example.com", ticket_id: 1213},
];

async function getAll(){
    if (!await hasDummyUsersBeenInserted()) {
        for (const user of dummyUsers) {
            await pgClient.query(
                "INSERT INTO users (firstName, lastName, email, ticket_id) VALUES ($1, $2, $3, $4)",
                [user.firstName, user.lastName, user.email, user.ticket_id]
            );
        }
    }

    const users = await pgClient.query("SELECT * FROM users");
    return users.rows;
}

async function create(users){
    const { firstName, lastName, email, ticketId } = users;
    if (!firstName || !lastName || !email || !ticketId) {
        throw new Error("Missing required user data");
    }

    const emailExists = await pgClient.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailExists.rows.length > 0) {
        throw new Error("Email already exists");
    }

    const result = await pgClient.query(
        "INSERT INTO users (firstName, lastName, email, ticket_id) VALUES ($1, $2, $3, $4)",
        [firstName, lastName, email, ticketId]
    );

    if (result.rowCount === 0) {
        throw new Error("Error creating user");
    }

    return { message: "User created successfully" };
}

async function remove(user) {
    const userId = user.id;

    if (!userId || !/^\d+$/.test(userId)) {
        throw new Error("Invalid user ID");
    }

    const result = await pgClient.query("DELETE FROM users WHERE id = $1", [userId]);

    if (result.rowCount === 0) {
        throw new Error("User not found");
    }
}

module.exports = {
    getAll,
    create,
    remove
}