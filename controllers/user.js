const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const phoneNumberFormatter = require("../middlewares/phoneNumberFormatter");
const Ticket = require("../models/ticket");
const Lottery = require("../models/lottery");
const Prize = require("../models/prize");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex =
    /(^\+\s*2\s*5\s*1\s*(9|7)\s*(([0-9]\s*){8}\s*)$)|(^0\s*(9|7)\s*(([0-9]\s*){8})$)/;
  return phoneRegex.test(phoneNumber);
};
const sendMessage = async (phoneNumber) => {
  const server = "https://sms.yegara.com/api2/send";
  const username = "biqiltuvas";
  const password = ";g77qYVu!t3Nb;Mz[U3";
  const verificationCode = Math.floor(1000 + Math.random() * 9000);
  const postData = {
    to: phoneNumber,
    message: verificationCode.toString(), // Convert to string for sending as message
    template_id: "otp",
    password,
    username,
  };
  try {
    const fetchModule = await import("node-fetch");
    const fetch = fetchModule.default;
    const response = await fetch(server, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const responseText = await response.text();
    if (response.ok) {
      return { success: true, verificationCode: verificationCode.toString() };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false };
  }
};
module.exports.registerUser = async (req, res) => {
  const { name, phoneNumber, password } = req.body;
  try {
    const formatedPhoneNumber = phoneNumberFormatter(phoneNumber);
    if (!formatedPhoneNumber) {
      res.status(400);
      throw new Error("please fill all the required fields");
    }
    const userExists = await User.findOne({ phoneNumber: formatedPhoneNumber });
    if (userExists) {
      res.status(400);
      throw new Error("phone number has already been used");
    }
    const user = new User({
      name,
      phoneNumber: formatedPhoneNumber,
      password,
    });
    await user.save();
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });
    res.status(201).json({
      _id,
      phoneNumber: formatedPhoneNumber,
      token,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.loginUser = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    if (!phoneNumber || !password) {
      res.status(400);
      throw new Error("please provide phoneNumber and password");
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      res.status(400);
      throw new Error("please provide a valid phone number");
    }
    const formatedPhoneNumber = phoneNumberFormatter(phoneNumber);
    const user = await User.findOne({ phoneNumber: formatedPhoneNumber });
    if (!user) {
      res.status(400);
      throw new Error("Invalid phone number or password");
    }
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (!passwordIsCorrect) {
      return res
        .status(400)
        .json({ message: "Invalid phone number or password" });
    }
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 86400 * 30),
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      phoneNumber: formatedPhoneNumber,
      token,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports.logoutUser = async (req, res, next) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({
    message: "successfully logged out",
  });
};

module.exports.selectTicket = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    // const { number, lotteryId, email } = req.body;
    const selectedTickets = await Ticket.find({
      number: last_name,
      lottery: first_name,
    });

    let index = "";
    for (let i = 0; i < email.length; i++) {
      if (email[i] === "@") {
        break;
      }
      index += email[i];
    }

    const count = selectedTickets.length;
    let maxAvailableTickets = 5;
    const lottery = await Lottery.findById({ first_name });
    if (lottery.name === "Medebegna") {
      maxAvailableTickets = 2;
    }
    if (count >= maxAvailableTickets) {
      return res
        .status(400)
        .json({ error: "Ticket not available for selection" });
    }

    // const selectedTicket = selectedTickets[selectedTickets.length - 1];
    const selectedTicket = new Ticket({
      number: last_name,
      lottery: first_name,
      user: index,
      purchaseDate: Date.now(),
    });

    if (count + 1 >= maxAvailableTickets) {
      selectedTicket.isAvailable = false;
    }
    await selectedTicket.save();
    res
      .status(200)
      .json({ message: "Ticket selected successfully", selectedTicket });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports.fetanLotto = async (req, res) => {
  try {
    const { lotteryId } = req.body;
    const user = await User.findById(req.user._id);
    const lotteryType = await Lottery.findById({ lotteryId });

    if (lotteryType.name == "Fetan") {
      const randomNumber = Math.random();
      let win;
      let message;
      const prizes = await Prize.find({ lottery: lotteryId });

      if (randomNumber < 0.8) {
        // 80% probability
        win = 0;
        message = "Sorry, you didn't win this time.";
      } else if (randomNumber < 0.9) {
        // 10% probability
        win = prizes.prize.amount[2];
        message = "Congratulations! You won 5 Birr.";
      } else if (randomNumber < 0.98) {
        // 8% probability
        win = prizes.prize.amount[1];
        message = "Wow! You won 1000 Birr.";
      } else {
        // 2% probability
        win = prizes.prize.amount[0];
        message = "Jackpot! You won 25,000 Birr";
      }

      user.balance += win;
      await user.save();

      res.json({ win, message });
    }
  } catch (error) {}
};
