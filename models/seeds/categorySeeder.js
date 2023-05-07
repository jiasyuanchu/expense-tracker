if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Category = require("../category");
const db = require("../../config/mongoose");
const CATEGORY = {
  Housing: 'fa-solid fa-house',
  Transportation: 'fa-solid fa-van-shuttle',
  Entertainment: 'fa-solid fa-face-grin-beam',
  FoodandBeverage: 'fa-solid fa-utensils',
  Other: 'fa-solid fa-pen',
};

console.log(process.env.MONGODB_URI);

const categories = [];


for (let category in CATEGORY) {
  categories.push({ name: category, icon: CATEGORY[category] });
}

db.once("open", async () => {
  try {
    await Promise.all(categories.map((category) => Category.create(category)));
    console.log("done");
    process.exit();
  } catch (error) {
    console.error(error);
  }
});
