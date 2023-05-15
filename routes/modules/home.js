const express = require('express')
const router = express.Router()

const Record = require("../../models/record");
const Category = require("../../models/category");

router.get("/", (req, res) => {
  res.redirect('/records')
});

//sorting
router.get("/sort", async (req, res) => {
  const { categoryFilter } = req.query;
  const userId = req.user._id;
  const sort = {};

  try {
    //get category from database
    const categories = await Category.find().lean();
    //avoid category = ""
    const hererecords = categoryFilter
      ? await Record.find({ userId, categoryId: categoryFilter })
        .sort(sort)
        .lean()
      : await Record.find({ userId }).sort(sort).lean();

    //format records and create into database
    const records = hererecords.map((record) => {
      const icon = categories.find(
        (category) => category._id.toString() === record.categoryId.toString()
      ).icon;

      //format date to YYYY-MM-DD
      record.date = new Date(record.date).toISOString().slice(0, 10);
      const formattedRecord = {
        ...record,
        icon,
      };
      return formattedRecord;
    });
    //count the total amount by the selected category
    let totalAmount = 0;
    for (const record of records) {
      totalAmount += record.amount;
    }
    totalAmount = totalAmount.toLocaleString();

    res.render("index", {
      categories,
      records,
      totalAmount,
      categoryFilter: categoryFilter
        ? categories.find((c) => c._id.toString() === categoryFilter).name
        : "",
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
