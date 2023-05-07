require('../../config/mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  console.log('dot env is required')
}

const db = require('../../config/mongoose')
const Category = require('../category')
const categoryData = require('../seedsData/category.json').results

db.once('open', async () => {
  console.log('starting categorySeeder...')
  console.log('creating category data...')
  try {
    await Category.create(categoryData)
    console.log('categorySeeder done')
    process.exit()
  } catch (error) {
    console.log(error)
  }
})