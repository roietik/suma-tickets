import express from "express";
const emailsRouter = express.Router();
import emailsController from "../controllers/emails.controller.js";

emailsRouter.post('/', emailsController.sendEmail);

export default emailsRouter;
