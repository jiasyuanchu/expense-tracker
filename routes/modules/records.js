const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const Record = require('../../models/record')
const Category = require("../../models/category")

router.get('/new', (req, res) => {
  return res.render('new')
})


router.post('/new', async (req, res) => {
  const data = req.body
  const categories = await Category.find({}).lean()
  const TargetCategory = categories.find(cate => cate.name === data.category)
  data.userId = req.user._id
  data.categoryId = TargetCategory._id
  await Record.create(data)
  res.redirect('/records')
})

module.exports = router