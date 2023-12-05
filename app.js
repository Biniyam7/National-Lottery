const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Tekle is Asshole!"));

app.listen(port, () => console.log(`Express app running on port ${port}!`));
