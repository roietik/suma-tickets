const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRouter = require('./routes/users.route.js');
const valuesRouter = require("./routes/values.route.js");
const ticketsRouter = require("./routes/tickets.route");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    res.send("API");
});

app.use('/users', usersRouter);
app.use('/values', valuesRouter);
app.use('/tickets', ticketsRouter);

app.listen(5050, err => {
    console.log("Listening");
});
