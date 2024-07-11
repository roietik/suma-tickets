const express = require('express');
const employeesRouter = express.Router();
const employeesController = require('../controllers/employees.controller');

employeesRouter.get('/', employeesController.getAll);
employeesRouter.delete('/:id', employeesController.remove);

module.exports = employeesRouter;
