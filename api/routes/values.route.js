const express = require('express');
const valuesRouter = express.Router();
const valuesController = require('../controllers/values.controller');

valuesRouter.get('/', valuesController.get);
valuesRouter.post('/', valuesController.post);
valuesRouter.put('/:id', valuesController.put);
valuesRouter.delete('/:id', valuesController.remove);

module.exports = valuesRouter;