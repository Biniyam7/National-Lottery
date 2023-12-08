const express = require("express");

const router = express.Router();
const isVendorActive = require("../middlewares/isVendorActive");
const protect = require("../middlewares/authVendor");

const { sellTicket } = require("../controllers/vendor");

router.post("/sellTicket", protect, isVendorActive, sellTicket);

module.exports = router;
