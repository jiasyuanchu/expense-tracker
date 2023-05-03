const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars');

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes')
// require('./config/mongoose')

const app = express()
const port = process.env.PORT

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

//建立名為hbs的樣版引擎並傳入exphbs的相關參數
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  helpers: {
    select: function (selected, options) {
      return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
    }
  }
}))


app.use(express.static('public'))

//啟動樣版引擎hbs
app.set('view engine', 'handlebars')
app.use(routes)
app.listen(port, () => {
  console.log(`this is running on http://localhost:${port}`)
})