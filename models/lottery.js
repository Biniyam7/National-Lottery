const mongoose = require("mongoose");
const Schema = mongoose.Schema;

lotterySchema = new Schema({
  name: {
    type: String,
    //required: true,
    enum: ["Enqutatash", "Tombolla", "Zihon", "Gena", "Edil", "Fetan", "Bingo"],
  },
  descripton: String,
  startDate: {
    type: Date,
    required: true,
  },
  drawDate: {
    type: Date,
    required: true,
  },
  Status: {
    type: String,
    enum: ["Active", "Expired"],
  },
  prize: {
    type: Schema.Types.ObjectId,
    ref: "Prize",
  },
});

const Lottery = mongoose.model("Lottery", lotterySchema);

module.exports = Lottery;
