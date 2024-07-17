import ticketsService from "../services/tickets.service.js";

async function getTicketCount(request, response) {
    try {
        response.send(await ticketsService.getTicketCount());
    } catch ({ code, message }) {
        const errorMessage = `Error fetching tickets: ${message}`;
        console.error(errorMessage);
        response.status(500).send(errorMessage);
    }
}

async function getUniqueTicketNumber(request, response) {
    try {
        response.send(await ticketsService.getUniqueTicketNumber());
    } catch ({ code, message }) {
        const errorMessage = `Error fetching tickets: ${message}`;
        console.error(errorMessage);
        response.status(500).send({error: errorMessage});
    }
}

async function getTicketsLimit(request, response) {
    try {
        response.status(200).send( await ticketsService.getTicketsLimit());
    } catch ({ code, message }) {
        const errorMessage = `An unexpected error occurred while setting the ticket limit: ${message}`;
        console.error(errorMessage);
        response.status(500).send(errorMessage);
    }
}

async function setTicketsLimit(request, response) {
    try {
        await ticketsService.setTicketsLimit(request, response);
        response.status(200).send({ message: 'Ticket limit updated successfully: ' + request.body.ticket_limit });
    } catch ({ code, message }) {
        const errorMessage = `An unexpected error occurred while setting the ticket limit: ${message}`;
        console.error(errorMessage);
        response.status(500).send(errorMessage);
    }
}

async function getTicketsSoldOut(request, response) {
    try {
        response.status(200).send( await ticketsService.getTicketsSoldOut());
    } catch ({ code, message }) {
        const errorMessage = `An unexpected error occurred while setting the ticket sold out: ${message}`;
        console.error(errorMessage);
        response.status(500).send(errorMessage);
    }
}

async function setTicketsSoldOut(request, response) {
    try {
        await ticketsService.setTicketsSoldOut(request, response);
        response.status(200).send(request.body.ticketsSoldOut);
    } catch ({ code, message }) {
        const errorMessage = `An unexpected error occurred while setting the ticket sold out: ${message}`;
        console.error(errorMessage);
        response.status(500).send({error: errorMessage});
    }
}


export default {
    getTicketCount,
    getUniqueTicketNumber,
    setTicketsLimit,
    getTicketsLimit,
    getTicketsSoldOut,
    setTicketsSoldOut
};