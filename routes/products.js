const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Product = require("../models/product");
const Collection = require("../models/category");
const { avgPrice, calcTotal, roundToDecimal } = require("../utils/avgPrice");
const { categories } = require("../utils/baseFields");
const { isLoggedIn } = require("../middlewares");
const User = require("../models/userSchema");

router.use(isLoggedIn);

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const { category } = req.query;
    const curUser = res.locals.currentUser;
    const user = await User.findByUsername(curUser.username)
      .populate("products")
      .populate("categories");

    if (category) {
   
      const newProds = user.products.filter((prod) => prod.category === category);
 
      res.render("products/index", {
        user,
        products: newProds,
        category,
        sum: "0-0",
        round: roundToDecimal,
      });
    } else {
      const sum = calcTotal(user.products);

      res.render("products/index", {
        user,
        products: user.products,
        category: "All",
        sum,
        round: roundToDecimal,
      });
    }
  })
);
router.get("/new", (req, res) => {
  res.render("products/new", { categories });
});
router.post(
  "/",
  wrapAsync(async (req, res) => {
    //const { name, price, category } = req.body
    req.body.price = 0;
    const curUser = res.locals.currentUser;
    const newProduct = new Product(req.body);
    // if(res.locals.currentUser) res.locals.currentUser.products.push(newProduct)
    newProduct.owner = curUser;

    const collection = await Collection.findOne({ name: newProduct.category });
    collection.products.push(newProduct);

    if (curUser === null) return res.redirect("/login");
    const user = await User.findByUsername(curUser.username)
      .populate("products")
      .populate("categories");

    user.categories.push(collection);
    user.products.push(newProduct);

    await user.save();
    await newProduct.save();
    await collection.save();
    await avgPrice(newProduct);
    // console.log(user, "hi")

    req.flash("success", "successfully made product".toUpperCase());
    res.redirect(`/products/${newProduct._id}`);
  })
);

router.delete(
  "/",
  wrapAsync(async (req, res) => {
    await Product.deleteMany({});
    res.redirect(`/products`);
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      req.flash("error", "Cannot find that product!");
      return res.redirect("/products");
      //throw new AppError("products/notfound", 404)
    }
    res.render("products/show", { product });
  })
);
router.get(
  "/new/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      throw new AppError("products/notfound", 404);
    }
    res.render("products/edit", { product, categories });
  })
);

router.put(
  "/:id/",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!req.body.buy) {
      req.body.buy = "off";
    }
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    await avgPrice(product);
    req.flash("success", "successfully edited product".toUpperCase());
    res.redirect(`/products/${product.id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const curUser = res.locals.currentUser;
    const deletedProduct = await Product.findByIdAndDelete(id);
    const user = await User.findByUsername(curUser.username)
      .populate({
        path: "categories",
        populate: [{ path: "products" }, { path: "owner" }],
      })
      .populate("products");
    const categories = user.categories;
    const filteredCategories = categories.filter(
      (category) => category.products.length > 0
    );

    user.categories = filteredCategories.length > 0 ? filteredCategories : [];

    await Collection.updateMany(
      { products: deletedProduct._id },
      {
        $pull: { products: deletedProduct._id },
        $inc: { length: -1 },
      }
    );
    await User.updateMany(
      { products: deletedProduct._id },
      {
        $pull: { products: deletedProduct._id },
        $inc: { length: -1 },
      }
    );
    await user.save();

    req.flash("success", "successfully deleted product".toUpperCase());
    res.redirect(`/products`);
  })
);

module.exports = router;
