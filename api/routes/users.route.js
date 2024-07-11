const express = require('express');
const usersRouter = express.Router();
const usersController = require('../controllers/users.controller');

usersRouter.get('/', usersController.getAll);
usersRouter.post('/', usersController.post);
usersRouter.delete('/:id', usersController.remove);
usersRouter.post('/is-email-exist', usersController.isEmailExists);

module.exports = usersRouter;
