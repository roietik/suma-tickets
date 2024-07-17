import express from "express";
import usersController from "../controllers/users.controller.js";
const usersRouter = express.Router();

usersRouter.get('/', usersController.getAll);
usersRouter.post('/', usersController.post);
usersRouter.delete('/:id', usersController.remove);
usersRouter.post('/is-email-exist', usersController.isEmailExists);

export default usersRouter;
