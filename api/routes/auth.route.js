const express = require('express');
const authRouter = express.Router();
const employeesController = require('../controllers/employees.controller');

authRouter.post('/register', employeesController.registration);
authRouter.post('/login', employeesController.login);
authRouter.post('/logout', employeesController.logout);
authRouter.get('/token', employeesController.token);

module.exports = authRouter;
