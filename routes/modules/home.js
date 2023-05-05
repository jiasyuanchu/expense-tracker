const express = require('express')
const router = express.Router()

const Record = require("../../models/record");
const Category = require("../../models/category");


router.get("/", (req, res) => {
  const userId = req.user._id;
  const { name, date, amount } = req.body
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
              record.date = new Date(record.date).toISOString().slice(0, 10);
              const totalRecord = {
                ...record,
                icon,
              };
              return totalRecord;
            })
          );
        })
        .then((expense) => {
          let totalAmount = '10'
          totalAmount = totalAmount.toLocaleString();

          res.render("index", {
            icon,
            name,
            date,
            categories,
            expense,
            totalAmount,
          });
        })
        .catch((err) => console.error(err));
    });
});

//practice async/await
router.get("/sort", async (req, res) => {
  const { categoryFilter, sortWay, sortBy } = req.query;
  const userId = req.user._id;
  let income = 0;
  let expense = 0;
  const sort = {};
  sort[sortBy] = sortWay;

  try {
    //get category from database
    const categories = await Category.find().lean();
    //avoid category = ""
    const records = categoryFilter
      ? await Record.find({ userId, categoryId: categoryFilter })
        .sort(sort)
        .lean()
      : await Record.find({ userId }).sort(sort).lean();

    //create records and put into database
    const finalRecords = records.map((record) => {
      const icon = categories.find(
        (category) => category._id.toString() === record.categoryId.toString()).icon;

      //format date to YYYY-MM-DD
      record.date = new Date(record.date).toISOString().slice(0, 10);

      if (record.type === "income") {
        income += record.amount;
      } else if (record.type === "expense") {
        expense += record.amount;
      }
      const formattedRecord = {
        ...record,
        icon,
      };
      return formattedRecord;
    });

    let totalAmount = income - expense;
    const totalAmountColor = totalAmount >= 0 ? "info" : "danger";
    //format amount to XXX,XXX
    income = income.toLocaleString();
    expense = expense.toLocaleString();
    totalAmount = totalAmount.toLocaleString();

    res.render("index", {
      categories,
      finalRecords,
      income,
      expense,
      totalAmount,
      totalAmountColor,
      categoryFilter: categoryFilter
        ? categories.find((c) => c._id.toString() === categoryFilter).name
        : "",
      sortWay,
      sortBy,
    });
  } catch (err) {
    console.log(err);
  }
});


module.exports = router