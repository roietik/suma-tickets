const pgClient = require("./database.service");

async function getUniqueTicketNumber(){
    const tickets = await pgClient.query("SELECT COUNT(*) FROM tickets");
    const count = Number(tickets.rows[0].count);
    return String(count + 1);
}

module.exports = {
    getUniqueTicketNumber
}