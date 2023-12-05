const mongoose = require("mongoose");
const Schema = mongoose.Schema;

ticketSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lottery: {
    type: Schema.Types.ObjectId,
    ref: "Lottery",
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    enum: ["A", "B", "C", "D", "E"],
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
  prize: {
    type: Schema.Types.ObjectId,
    ref: "Prize",
  },
});
ticketSchema.pre("save", function (next) {
  if (this.status === "lose") {
    this.prize = null;
  }
  next();
});
const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
