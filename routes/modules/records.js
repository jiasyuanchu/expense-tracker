const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const Record = require('../../models/record')
const Category = require("../../models/category")

router.get('/new', async (req, res) => {
  const categories = await Category.find({}).lean()
  res.render('new', { categories })
})

router.post('/new', async (req, res) => {
  const data = req.body
  const categories = await Category.find({}).lean()
  const selectedCategory = categories.find(cate => cate.name === data.category)
  data.userId = req.user._id
  data.categoryId = selectedCategory._id
  await Record.create(data) // 等待create資料
  res.redirect('/records')
})

//render根目錄
router.get('/', async (req, res) => {
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
    let totalAmount = 0
    const categories = await Category.find({}).lean()
    records.forEach((record) => {
      totalAmount += record.amount
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
    const totalAmountString = totalAmount.toLocaleString('zh-TW', { style: 'currency', currency: 'TWD' }).split('.')[0]

    // console.log(records)
    // 回傳 records
    res.render('index', {
      records,
      totalAmountString,
      categories,
      selectedCategory,
      sort
    })
  } catch (error) {
    res.locals.warning_msg = '出現預期外的問題，請您再嘗試一次。'
    console.log(error)
    return res.render('index')
  }
})

module.exports = router