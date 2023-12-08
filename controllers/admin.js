const Admin = require("../models/admin");
const Lottery = require("../models/lottery");
const Prize = require("../models/prize");
const Vendor = require("../models/vendor");

module.exports.addLotteryInfo = async (req, res) => {
  try {
    const { name, description, startDate, drawDate, prize, price } = req.body;

    const lottery = await Lottery.findOne({ name });
    if (!Object.values(Lottery.schema.path("name").enumValues).includes(name)) {
      return res.status(400).json({ message: "Invalid lottery name!" });
    }
    if (lottery && lottery.drawDate) {
      return res.status(400).json({ message: "this lottery already exists!" });
    }
    const newLottery = new Lottery({
      name,
      description,
      startDate,
      drawDate,
      price,
    });

    const saveLottery = await newLottery.save();
    const newPrize = new Prize({
      prize,
      lottery: saveLottery._id,
    });
    const savePrize = await newPrize.save();

    saveLottery.prize = savePrize._id;
    await saveLottery.save();
    res.status(201).json(saveLottery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getLotteries = async (req, res) => {
  try {
    const lotteries = await Lottery.find().populate("prize");
    // for (const lottery of lotteries) {
    // console.log(lottery.prize.prize);
    //   for (const prize of lottery.prize.prize) {
    //     console.log(prize.level);
    //   }
    // }
    // const prizes = await Prize.find();
    // console.log(prizes[0].prize[0]);
    if (lotteries) {
      res.json({ lotteries });
    }
  } catch (error) {
    // console.log(error);
    return res.status(404).json("no records");
  }
};
module.exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    if (vendors) {
      res.json({ vendors });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json("no records");
  }
};
