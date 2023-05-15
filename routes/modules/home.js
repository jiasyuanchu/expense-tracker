const express = require('express')
const router = express.Router()

const Record = require("../../models/record");
const Category = require("../../models/category");

router.get("/", (req, res) => {
  res.redirect('/records')
});

module.exports = router;
