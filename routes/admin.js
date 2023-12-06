const express = require("express");
const router = express.Router();

const { addLotteryInfo, getLotteries } = require("../controllers/admin");

router.post("/addLottery", addLotteryInfo);
router.get("/lotteries", getLotteries);

module.exports = router;
