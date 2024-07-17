import express from "express";
import ticketsController from "../controllers/tickets.controller.js";
const ticketsRouter = express.Router();

ticketsRouter.get('/count', ticketsController.getTicketCount);
ticketsRouter.get('/unique-id', ticketsController.getUniqueTicketNumber);
ticketsRouter.get('/limit', ticketsController.getTicketsLimit);
ticketsRouter.post('/limit', ticketsController.setTicketsLimit);
ticketsRouter.get('/sold-out', ticketsController.getTicketsSoldOut);
ticketsRouter.post('/sold-out', ticketsController.setTicketsSoldOut);

export default ticketsRouter;
