const ticketsService = require("../services/tickets.service");

async function getUniqueTicketNumber(request, response) {
    try {
        response.send(await ticketsService.getUniqueTicketNumber());
    } catch ({ code, message }) {
        const errorMessage = `Error fetching tickets: ${message}`;
        console.error(errorMessage);
        response.status(500).send({error: errorMessage});
    }
}

module.exports = {
    getUniqueTicketNumber
}