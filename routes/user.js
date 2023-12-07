const express = require("express");
const router = express.Router();

const { fetanLotto, selectTicket } = require("../controllers/user");

router.post("/fetan", fetanLotto);
router.post("/ticket", selectTicket);
module.exports = router;
