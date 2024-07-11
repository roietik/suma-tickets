const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRouter = require('./routes/users.route.js');
const ticketsRouter = require("./routes/tickets.route");
const emailsRouter = require("./routes/emails.route");
const createTables = require("./services/create-tables.service");
const pgClient = require("./config/pg-client.config");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "200mb" }));

pgClient.on("connect", client => {
    console.log('pgClient: connect');
    createTables(client);
});

app.get("/", (req, res) => {
    res.send("API");
});

app.use('/users', usersRouter);
app.use('/tickets', ticketsRouter);
app.use('/emails', emailsRouter);

app.listen(5050, err => {
    console.log("Listening");
});
