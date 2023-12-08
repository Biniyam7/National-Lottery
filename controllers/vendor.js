const Vendor = require("../models/vendor");
const Lottery = require("../models/lottery");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const phoneNumberFormatter = require("../middlewares/phoneNumberFormatter");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex =
    /(^\+\s*2\s*5\s*1\s*(9|7)\s*(([0-9]\s*){8}\s*)$)|(^0\s*(9|7)\s*(([0-9]\s*){8})$)/;
  return phoneRegex.test(phoneNumber);
};
module.exports.registerVendor = async (req, res) => {
  try {
    const { name, phoneNumber, password } = req.body;

    if (!name || !phoneNumber || !password) {
      return res.status(400).json({ error: "please fill all the fields" });
    }
    const formatedPhoneNumber = phoneNumberFormatter(phoneNumber);
    const vendorExists = await Vendor.findOne({ formatedPhoneNumber });
    if (vendorExists) {
      res.status(400);
      throw new Error("phone number has already been used");
    }
    const vendor = new Vendor({
      name,
      phoneNumber: formatedPhoneNumber,
      password,
    });
    await vendor.save();
    const token = generateToken(vendor._id);
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

module.exports.loginVendor = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      res.status(400);
      throw new Error("please provide phoneNumber and password");
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      res.status(400);
      throw new Error("please provide a valid phone number");
    }
    const formatedPhoneNumber = phoneNumberFormatter(phoneNumber);
    const vendor = await Vendor.findOne({ phoneNumber: formatedPhoneNumber });
    if (!vendor) {
      return res
        .status(400)
        .json({ message: "invalid phone number or password" });
    }
    const passwordIsCorrect = await bcrypt.compare(password, vendor.password);
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
module.exports.logoutVendor = async (req, res, next) => {
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
module.exports.sellTicket = async (req, res) => {
  const { ticketNumber, lotteryId, phoneNumber } = req.body;
  const selectedTickets = await Ticket.find({
    number: ticketNumber,
    lottery: lotteryId,
  });

  const count = selectedTickets.length;
  let maxAvailableTickets = 5;
  const lottery = await Lottery.findById({ lotteryId });
  if (lottery.name === "Medebegna") {
    maxAvailableTickets = 2;
  }
  if (count >= maxAvailableTickets) {
    return res
      .status(400)
      .json({ error: "Ticket not available for selection" });
  }

  const user = new User({
    phoneNumber,
  });
  await user.save();
  const selectedTicket = new Ticket({
    number: ticketNumber,
    lottery: lotteryId,
    user: user._id,
    purchaseDate: Date.now(),
  });

  if (count + 1 >= maxAvailableTickets) {
    selectedTicket.isAvailable = false;
  }
  selectedTicket.vendor = req.user._id;
  await selectedTicket.save();
  const seller = await Vendor.findById(req.user._id);
  seller.ticketsSold.push(selectedTicket._id);
  seller.balance = +1;

  await seller.save();
  res
    .status(200)
    .json({ message: "Ticket sold successfully", selectedTicket, seller });
};
