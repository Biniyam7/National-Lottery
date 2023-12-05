const express = require("express");
const dotenv = require("dotenv").config();
const connectdb = require("./config/db");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
connectdb();

app.get("/", (req, res) => res.send("Bini is misogynistic Asshole!"));

app.listen(port, () =>
  console.log(`Tekle's Asshole is running on port ${port}!`)
);
