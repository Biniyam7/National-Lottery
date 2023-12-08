const Chapa = require("chapa");
const Lottery = require("../models/lotter");
const Ticket = require("../models/ticket");

let myChapa = new Chapa("CHASECK_TEST-7mSnUUlCknqZrInKDc9QusA7zy7KNONq");

module.exports.payLottery = async (req, res) => {
  try {
    const id = req.user._id;
    const { lotteryId, ticketNumber, phoneNumber } = req.body;
    const lotteryType = await Lottery.findById({ lotteryId });
    const name = lotteryType.name;

    const selectedTickets = await Ticket.find({
      number: lotteryId,
      lottery: lotteryId,
    });

    const count = selectedTickets.length;
    let maxAvailableTickets = 5;
    const lottery = await Lottery.findOne({ _id: lotteryId });
    if (lottery.name === "Medebegna") {
      maxAvailableTickets = 2;
    }
    if (count >= maxAvailableTickets) {
      return res
        .status(400)
        .json({ error: "Ticket not available for selection" });
    }

    const customerInfo = {
      amount: 50,
      currency: "ETB",
      email: `${id}@gmail.com`,
      first_name: lotteryId,
      last_name: ticketNumber,
      phone_number: phoneNumber,
      tx_ref: tx_ref,
      callback_url: "http://localhost:3000/api/user/ticket",
      return_url: "http://localhost:3000/",
      customization: {
        title: name,
        description: "payment for Lottery",
      },
    };

    const response = await myChapa.initialize(customerInfo, { autoRef: true });

    res.json(response);
    //res.redirect(response.data.checkout_url)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
