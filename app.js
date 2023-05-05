const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars');
const helpers = require("./views/helpers/helpers");
const bodyParser = require('body-parser')
const routes = require('./routes')
const app = express()
const PORT = process.env.PORT || 3000;
const usePassport = require('./config/passport')

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// require('./config/mongoose')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

//set view template
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs", helpers }));
app.set("view engine", "hbs");

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true })) //須放在app use router之前
app.use(express.static('public'))

usePassport(app)

app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use(routes)


app.listen(PORT, () => {
  console.log(`this is running on http://localhost:${PORT}`)
})