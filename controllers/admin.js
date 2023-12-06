const Admin = require("../models/admin");
const Lottery = require("../models/lottery");
const Prize = require("../models/prize");

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
    const lotteries = await Lottery.find();
    if (lotteries) {
      res.json({ lotteries });
    }
  } catch (error) {
    return res.status(404).json("no records");
  }
};
