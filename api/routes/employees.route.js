import express from "express";
const employeesRouter = express.Router();
import employeesController from "../controllers/employees.controller.js";

employeesRouter.get('/', employeesController.getAll);
employeesRouter.delete('/:id', employeesController.remove);

export default employeesRouter;
