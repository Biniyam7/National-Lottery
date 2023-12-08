const Chapa = require("chapa");
const Lottery = require("../models/lottery");
const Ticket = require("../models/ticket");

let myChapa = new Chapa("CHASECK_TEST-7mSnUUlCknqZrInKDc9QusA7zy7KNONq");

function generateRandomNumber() {
  const min = 100000;
  const max = 9999999;

  // Generate a random number within the specified range
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
}

// Example usage
const randomNum = generateRandomNumber();

module.exports.payLottery = async (req, res) => {
  try {
    // const id = req.user._id;
    const { lotteryId, ticketNumber, phoneNumber } = req.body;
    const lotteryType = await Lottery.findById(lotteryId);
    // const name = lotteryType.name;

    const selectedTickets = await Ticket.find({
      number: ticketNumber,
      lottery: lotteryId,
    });

    const count = selectedTickets.length;
    let maxAvailableTickets = 5;
    // const lottery = await Lottery.findOne({ _id: lotteryId });
    // if (lottery.name === "Medebegna") {
    //   maxAvailableTickets = 2;
    // }
    if (count >= maxAvailableTickets) {
      return res
        .status(400)
        .json({ error: "Ticket not available for selection" });
    }

    const customerInfo = {
      amount: 50,
      currency: "ETB",
      email: "6572b7fe1a03c970adb77f29@gmail.com",
      first_name: lotteryId,
      last_name: ticketNumber,
      phone_number: phoneNumber,
      tx_ref: `lotto${randomNum}`,
      callback_url: "http://localhost:3000/api/user/ticket",
      return_url: "http://localhost:3000/",
      customization: {
        title: "Lottery",
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
