const express = require('express');
const usersRouter = express.Router();
const usersController = require('../controllers/users.controller');

usersRouter.get('/', usersController.get);
usersRouter.post('/', usersController.post);
usersRouter.delete('/:id', usersController.remove);

module.exports = usersRouter;
