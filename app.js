const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars');
const helpers = require("./views/helpers/helpers");
const routes = require('./routes')
const app = express()
const PORT = process.env.PORT || 3000;

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}



// require('./config/mongoose')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

//set view template
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs", helpers }));
app.set("view engine", "hbs");

app.use(express.static('public'))
app.use(routes)


app.listen(PORT, () => {
  console.log(`this is running on http://localhost:${PORT}`)
})