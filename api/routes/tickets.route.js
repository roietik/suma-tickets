const express = require('express');
const ticketsRouter = express.Router();

const dummyTickets = [
    { id: 1, base64: "John", user_id: "22" },
    { id: 2, base64: "Jane", user_id: "33" },
    // Add more dummy tickets as needed
];
ticketsRouter.get('/', async (req, res) => {
    res.status(200).json(dummyTickets);
});

ticketsRouter.post('/', async (req, res) => {
    try {
        // Validate and destructure ticket data from the request body
        const { id, base64, user_id } = validateTicketData(req.body);

        // Add the new ticket to the dummy data array
        dummyTickets.push({ id, base64, user_id });

        // Send a success response with the newly created ticket
        res.status(201).json({ id, base64, user_id });
    } catch (err) {
        console.error("Error creating ticket:", err);
        res.status(400).send({ error: err.message });
    }
});

ticketsRouter.delete('/:id', async (req, res) => {
    try {
        const ticketId = parseInt(req.params.id); // Convert ID to integer

        // Find the index of the ticket in the dummy data array
        const ticketIndex = dummyTickets.findIndex(ticket => ticket.id === ticketId);

        // Check if the ticket exists
        if (ticketIndex === -1) {
            throw new Error("Ticket not found");
        }

        // Remove the ticket from the dummy data array
        dummyTickets.splice(ticketIndex, 1);

        // Send a success response without any data
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting ticket:", err);
        res.status(400).send({ error: err.message });
    }
});

module.exports = ticketsRouter;