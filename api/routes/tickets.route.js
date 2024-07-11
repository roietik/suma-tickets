const express = require('express');
const ticketsRouter = express.Router();
const ticketsController = require('../controllers/tickets.controller');

ticketsRouter.get('/count', ticketsController.getTicketCount);
ticketsRouter.get('/unique-id', ticketsController.getUniqueTicketNumber);
ticketsRouter.get('/limit', ticketsController.getTicketsLimit);
ticketsRouter.post('/limit', ticketsController.setTicketsLimit);
ticketsRouter.get('/sold-out', ticketsController.getTicketsSoldOut);
ticketsRouter.post('/sold-out', ticketsController.setTicketsSoldOut);

module.exports = ticketsRouter;