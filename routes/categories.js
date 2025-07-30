const express = require("express");
const router = express.Router();
const Collection = require("../models/category");
const Product = require("../models/product");
const wrapAsync = require("../utils/wrapAsync");
const { avgPrice, calcTotal, roundToDecimal } = require("../utils/avgPrice");
const { categories } = require("../utils/baseFields");

const User = require("../models/userSchema");

const { index, deleteAllProductsInCategory } = require("../controllers/categories");

async function createCollection() {
  const products = await Product.find({});
  await Collection.deleteMany({});

  for (let cat of categories) {
    const collection = new Collection({
      name: cat,
      owner: null,
    });
    for (let product of products) {
      if (product.category === cat && cat.owner._id === user._id) {
        collection.products.push(product);
      }
    }

    collection.save();
  }
}

router.route("/").get(
  wrapAsync(index)
);

router.route("/deleteAll/:id").delete(wrapAsync(
  deleteAllProductsInCategory
))

// router.get("/greet", (req, res) => {
//     const { name = "No-name" } = req.cookies
//     const { username } = req.session;

//     res.send(`Welcome back ${username}`)
// })
// router.get("/setName", (req, res) => {
//     res.cookie("name", "Sams Chicken")
//     res.send("ok sent cookie")
// })

// router.get("/verifyfruit", (req, res) => {
//     console.log(req.cookies)
//     res.send(req.signedCookies)
// })

// router.get("/getsignedcookie", (req, res) => {
//     res.cookie("fruit", "grape", { signed: true })
//     res.send("SIGNED COOKIE")
// })

// router.get("/pageviews", (req, res) => {
//     if (req.session.count) req.session.count += 1
//     else req.session.count = 1
//     res.send(`YOU HAVE VIEWED THIS PAGE ${req.session.count} TIMES`)
// })

// router.get("/register", (req, res) => {
//     const { username = "Anonymous" } = req.query;
//     req.session.username = username;
//     res.redirect("/categories/greet")
// })

module.exports = router;
