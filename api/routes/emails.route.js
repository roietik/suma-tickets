const express = require('express');
const emailsRouter = express.Router();
const emailsController = require('../controllers/emails.controller');

emailsRouter.post('/', emailsController.sendEmail);

module.exports = emailsRouter;