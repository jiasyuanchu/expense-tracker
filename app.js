const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars');
const Record = require('./models/record')

const PORT = 3000

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

//建立名為hbs的樣版引擎並傳入exphbs的相關參數
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
//啟動樣版引擎hbs
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  Record.find() 
    .lean() 
    .then(records => res.render('index', { records })) 
    .catch(error => console.error(error)) 
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.listen(3000, () => {
  console.log(`this is running on http://localhost:${PORT}`)
})