const express = require("express");
const router = express.Router();

const { addLotteryInfo } = require("../controllers/admin");

router.post("/addLottery", addLotteryInfo);

module.exports = router;
