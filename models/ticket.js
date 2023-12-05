const mongoose = require("mongoose");
const Schema = mongoose.Schema;

ticketSchema = Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lottery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lottery",
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["win", "lose"],
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
