if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

console.log(process.env.MONGODB_URI);

// const mongoose = require("../../config/mongoose");
const db = require("../../config/mongoose");
const Category = require("../category");
const User = require("../user");
const Record = require("../record");
const bcrypt = require("bcryptjs")
const SEED_USERS = require('./user.json');
const SEED_RECORDS = require("./record.json");

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })


db.once("open", () => {
  Promise.all(
    SEED_USERS.map((USER) => {
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(USER.password, salt))
        .then((hash) =>
          User.create({
            name: USER.name,
            email: USER.email,
            password: hash,
          })
        )
        .then((user) => {
          const userId = user._id;
          return Promise.all(
            SEED_RECORDS.map((record) => { //產生關聯
              return Category.findOne({ name: record.category })
                .lean()
                .then((category) => {
                  const categoryId = category._id;
                  const expense = Object.assign({}, record, {
                    userId,
                    categoryId,
                  });
                  return Record.create(expense);
                })
            })
          );
        });
    })
  )
    .then(() => {
      console.log("All users and records are created.");
      process.exit();
    })
    .catch((e) => console.log(e));
});
