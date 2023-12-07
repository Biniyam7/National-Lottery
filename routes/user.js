const express = require("express");
const router = express.Router();

const { fetanLotto } = require("../controllers/user");

router.post("/fetan", fetanLotto);

module.exports = router;
