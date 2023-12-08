const express = require("express");
const router = express.Router();

const {
  addLotteryInfo,
  getLotteries,
  getVendors,
  activateVendor,
  suspendVendor,
} = require("../controllers/admin");

router.post("/addLottery", addLotteryInfo);
router.get("/lotteries", getLotteries);
router.get("/vendors", getVendors);
router.put("/activateVendor", activateVendor);
router.put("/suspendVendor", suspendVendor);

module.exports = router;
