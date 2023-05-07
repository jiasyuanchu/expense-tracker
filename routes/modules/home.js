const express = require('express')
const router = express.Router()

const Record = require("../../models/record");
const Category = require("../../models/category");

router.get("/", (req, res) => {
  const userId = req.user._id;
  let income = 0;
  let expense = 0;

  Category.find()
    .lean()
    .then((categories) => {
      Record.find({ userId })
        .lean()
        .then((records) => {
          return Promise.all(
            records.map((record) => {
              const icon = categories.find(
                (category) =>
                  category._id.toString() === record.categoryId.toString() 
              ).icon;
              record.date = new Date(record.date).toISOString().slice(0, 10);//只取YYYY-MM-DD
              const formattedRecord = {
                ...record,
                icon,
              };
              return formattedRecord;
            })
          );
        })
        .then((finalRecords) => {
          let totalAmount = 0;
          res.render("index", {
            categories,
            finalRecords,
            income,
            expense,
            totalAmount,
          });
        })
        .catch((err) => console.error(err));
    });
});


module.exports = router