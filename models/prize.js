const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prizeSchema = new Schema({
  level: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  lottery: {
    type: Schema.Types.ObjectId,
    ref: "Lottery",
    required: true,
  },
});

const Prize = mongoose.model("Prize", prizeSchema);
module.exports = Prize;
