const express = require('express')
const router = express.Router()

const Record = require("../../models/record");
const Category = require("../../models/category");

router.get("/", (req, res) => {
  res.redirect('/records')
});

//sorting
router.get("/sort", async (req, res) => {
  const { categoryFilter, sortWay, sortBy } = req.query;
  const userId = req.user._id;
  const sort = {};
  sort[sortBy] = sortWay;
  try {

    const userId = req.user._id
    const sort = req.query.sort || req.session.sort
    const sortObject = {}
    if (sort) { // create mongoose sort object
      const sortArray = sort.split('-')
      const key = sortArray[0]
      const value = sortArray[1]
      sortObject[key] = value
    } else {
      sortObject._id = 'asc'
    }
    req.session.sort = sort // 存入session
    let records = await Record.find({ userId }).lean().sort(sortObject)
    if (records.length === 0) {
      const noRecords = true
      return res.render('index', { noRecords })
    }

    let selectedCategory = req.query.category || req.session.category
    if (selectedCategory === 'ALL') {
      selectedCategory = ''
    }
    if (selectedCategory) {
      const category = await Category.findOne({ name: selectedCategory })
      const categoryId = category._id
      records = records.filter(record => record.categoryId.equals(categoryId))
    }
    req.session.category = selectedCategory // 存入session

    //針對each record 依據分類/計算金額
    let amount = 0
    const categories = await Category.find({}).lean()
    records.forEach((record) => {
      amount += record.amount
      const matchCate = categories.find(cate => {
        return record.categoryId.toString() === cate._id.toString()
      })
      if (matchCate) {
        record.iconLink = matchCate.icon
      }
      // 做出 font awesome icon
      const rawIcon = record.iconLink.split('/').slice(-1)[0].split('?')
      const iconShape = rawIcon[0]
      const iconClass = rawIcon[1].split('=')[1]

      const fontAwesomeClass =
        'fa-' + iconClass + ' ' + 'fa-' + iconShape
      // 存入 class
      record.fontAwesomeClass = fontAwesomeClass

      // 整理為乾淨的日期格式 year/month/date
      const date = new Date(record.date)
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
      const localDateString = date.toLocaleDateString('zh-TW', options)
      record.localDateString = localDateString
    })

    // 轉換成台幣，並拿掉小數點
    const totalAmount = amount.toLocaleString('zh-TW', { style: 'currency', currency: 'TWD' }).split('.')[0]

    res.render("index", {
      records,
      totalAmount,
      categories,
      selectedCategory,
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

module.exports = router;
