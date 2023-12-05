const mongoose = require("mongoose");
const Schema = mongoose.Schema;

lotterySchema = Schema({
  name: {
    type: String,
    //required: true,
    enum: ["Enqutatash", "Tombolla", "Zihon", "Gena", "Edil", "Fetan", "Bingo"],
  },

  descripton: String,
  Prize: [
    {
      type: String,
    },
  ],
  drawDate: Date,
  Status: {
    type: String,
    enum: ["Active", "Expired"],
  },
});

const Lottery = mongoose.model("Lottery", lotterySchema);

module.exports = Lottery;
