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

const app = express();
app.use(cookieParser());
app.use(cors({
    credentials: true,
    // TODO for prod
    origin: ['http://localhost:3050'],
}));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "200mb" }));

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
