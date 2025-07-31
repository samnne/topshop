const express = require("express");
const router = express.Router();
const Collection = require("../models/category");
const Product = require("../models/product");
const wrapAsync = require("../utils/wrapAsync");
const { avgPrice, calcTotal, roundToDecimal } = require("../utils/avgPrice");
const { categories } = require("../utils/baseFields");

const User = require("../models/userSchema");

const { index, deleteAllProductsInCategory } = require("../controllers/categories");

async function createCollection(user) {
  const products = await Product.find({}).populate("category");
  
  await Collection.deleteMany({});
 
  for (let cat of categories) {
    const collection = new Collection({
      name: cat,
      owner: user,
    });
    for (let product of products) {
      if (product.category.name === cat && cat.owner._id === user._id) {
        collection.products.push(product);
      }
    }

    collection.save();
  }
}


router.route("/").get(
  wrapAsync(index)
);
router.get("/admin/c2s3c02c2s5ckistflight127", (req, res)=>{
  const curUser = res.locals.currentUser ? res.locals.currentUser : null;
  createCollection(curUser);
  res.redirect("/categories")
})

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
