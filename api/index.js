const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRouter = require('./routes/users.route.js');
const ticketsRouter = require("./routes/tickets.route");
const emailsRouter = require("./routes/emails.route");
const authRouter = require("./routes/auth.route");
const employeesRouter = require("./routes/employees.route");
const createTables = require("./services/create-tables.service");
const pgClient = require("./config/pg-client.config");
const cookieParser = require("cookie-parser");

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
