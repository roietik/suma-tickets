import express from "express";
const authRouter = express.Router();
import employeesController from "../controllers/employees.controller.js";

authRouter.post('/register', employeesController.registration);
authRouter.post('/login', employeesController.login);
authRouter.post('/logout', employeesController.logout);
authRouter.get('/token', employeesController.token);

export default authRouter;
