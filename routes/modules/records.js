const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require("../../models/category")

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/new', (req, res) => {
  const { name, date, amount, categoryId } = req.body
  const userId = req.user._id
  console.log(req.body)
  return Record.create({ name, date, amount, categoryId })  // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

module.exports = router