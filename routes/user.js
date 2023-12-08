const express = require("express");
const router = express.Router();

const {
  fetanLotto,
  selectTicket,
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/user");

router.post("/fetan", fetanLotto);
router.post("/ticket", selectTicket);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
module.exports = router;
