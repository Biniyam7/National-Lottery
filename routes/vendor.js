const express = require("express");
const isVendorActive = require("../middlewares/isVendorActive");
const protect = require("../middlewares/authVendor");
const router = express.Router();

const { sellTicket } = require("../controllers/vendor");

router.post("/sellTicket", protect, isVendorActive, sellTicket);
