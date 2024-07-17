import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import usersRouter from "./routes/users.route.js";
import ticketsRouter from "./routes/tickets.route.js";
import emailsRouter from "./routes/emails.route.js";
import authRouter from "./routes/auth.route.js";
import employeesRouter from "./routes/employees.route.js";
import createTables from "./services/create-tables.service.js";
import pgClient from "./config/pg-client.config.js";
import cookieParser from "cookie-parser";
import corsConfig from "./config/cors.config.js";

const app = express();
app.use(cookieParser());
app.use(cors({ credentials: true, origin: [corsConfig.allowedOrigin] }));
app.use(bodyParser.json({ limit: "55mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "55mb" }));

pgClient.on("connect", async (client) => {
    console.log('pgClient: connect');
    await createTables(client);
});

app.get("/", (req, res) => {
    res.send("API");
});

app.use('/users', usersRouter);
app.use('/tickets', ticketsRouter);
app.use('/emails', emailsRouter);
app.use('/auth', authRouter);
app.use('/employees', employeesRouter);

app.listen(5050, err => {
    console.log("Listening");
});
