const express = require('express')
const exphbs = require('express-handlebars');
const routes = require('./routes')
const helpers = require("./views/helpers/helpers");
const bodyParser = require('body-parser')
const session = require('express-session')
const usePassport = require('./config/passport')
const app = express()
const PORT = process.env.PORT || 3000;

require('./config/mongoose')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  console.log('dot env is required')
}

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true })) //須放在app use router之前

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

//set view template
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs", helpers }));
app.set("view engine", "hbs");


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