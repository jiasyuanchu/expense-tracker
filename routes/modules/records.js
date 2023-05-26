const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const Record = require('../../models/record')
const Category = require("../../models/category")

router.get('/new', async (req, res) => {
  const categories = await Category.find({}).lean()
  res.render('new', { categories })
})

router.post("/new", async (req, res) => {
  try {
    let categories = await Category.find().lean();
    categories = categories.map((cate) => {
      cate._id = cate._id.toString();
      return cate;
    });

    const userId = req.user._id
    const { name, date, category, amount } = req.body;
    const data = req.body
    const selectedCategory = categories.find(cate => cate.name === data.category)
    data.categoryId = selectedCategory?._id //使用optional chaining對前端傳來空值時做處理
    let categoryId = data.categoryId

    const errors = [];

    // console.log(name);
    // console.log(date);
    // console.log(selectedCategory);
    // console.log(categoryId);
    // console.log(data.categoryId);
    // console.log(amount);

    if (!name || !date || !categoryId || !amount) {
      errors.push({ message: "All fields are required." });
    }

    if (errors.length) {
      res.render("new", {
        categories,
        name,
        date,
        category,
        categoryId,
        amount,
        errors,
      });
    } else {
      await Record.create({ name, date, category, categoryId, amount, userId });
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});


//render根目錄
router.get("/", (req, res) => {
  const userId = req.user._id;
  let totalAmount = 0;

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
              totalAmount += Number(record.amount)

              const formattedRecord = {
                ...record,
                icon,
              };
              return formattedRecord;
            })
          );
        })

        .then((formattedRecords) => {

          totalAmount = totalAmount.toLocaleString();

          res.render("index", {
            categories,
            records: formattedRecords, // 使用格式化後的記錄
            totalAmount,
          });
        })
        .catch((err) => console.error(err));
    });
});



//update editing 
router.get('/edit/:id', async (req, res) => {
  const recordId = req.params.id
  const record = await Record.findById(recordId).lean()
  // // guard for no record
  // if (!record) {
  //   req.flash('warning_msg', '出現預期外的問題，請您再嘗試一次。')
  //   return res.redirect('/records')
  // }
  const categories = await Category.find({}).lean()
  const category = categories.find(cate => cate._id.toString() === record.categoryId.toString())

  // convert date to year.month.day format
  const date = record.date.toISOString().slice(0, 10)

  res.render('edit', {
    id: record._id,
    name: record.name,
    amount: record.amount,
    category: category.name,
    date,
    categories
  })
})

// Update sending updates
router.put("/edit/:id", (req, res) => {
  const _id = req.params.id;
  const userId = req.user._id;
  console.log(req.body)
  Record.findOneAndUpdate({ _id, userId }, req.body)
    .then(() => res.redirect("/"))
    .catch((e) => console.log(e));
});

// delete function
router.delete("/delete/:id", (req, res) => {
  const _id = req.params.id;
  const userId = req.user._id;
  Record.findOne({ _id, userId })
    .then((record) => {
      return record.remove();
    })
    .then(() => res.redirect("/"))
    .catch((e) => console.log(e));
});


module.exports = router