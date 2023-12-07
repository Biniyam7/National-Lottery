const express = require("express");
const { payLottery } = require("../controllers/pay");
const router = express.Router();

router.post("/pay", payLottery);
module.exports = router;
