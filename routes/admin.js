const express = require("express");
const router = express.Router();

const {
  addLotteryInfo,
  getLotteries,
  getVendors,
} = require("../controllers/admin");

router.post("/addLottery", addLotteryInfo);
router.get("/lotteries", getLotteries);
router.get("/vendors", getVendors);

module.exports = router;
