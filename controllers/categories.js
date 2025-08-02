const { roundToDecimal } = require("../utils/avgPrice");

const User = require("../models/userSchema");
const Collection = require("../models/category");
const Product = require("../models/product");

const index = async (req, res, next) => {
  
  const curUser = res.locals.currentUser ? res.locals.currentUser : null;

  const user = await User.findByUsername(curUser?.username).populate({
    path: "categories",
    populate: [{ path: "products" }, { path: "owner" }],
  });

  res.render("categories/index", {
    user,
    collections: user?.categories ? user.categories : [],
    round: roundToDecimal,
  });
};

const deleteAllProductsInCategory = async (req, res, next) => {
  const { id } = req.params;
  const curUser = res.locals.currentUser ? res.locals.currentUser : null;
  const user = await User.findByUsername(curUser?.username).populate({
    path: "categories",
    populate: [{ path: "products" }, { path: "owner" }],
  });
  const category = await Collection.findById(id);
  if (!category) {
    req.flash("error", "Category not found");
    return res.redirect("/categories");
  }
  const userCategory = user.categories.find(
    (cat) => cat._id.toString() === category._id.toString()
  );
  if (!userCategory) {
    req.flash("error", "Category not found in user");
    return res.redirect("/categories");
  }
  const productIds = userCategory.products.map((p) => p._id);

  // Remove products from all users and collections
  await User.updateMany(
    { products: { $in: productIds } },
    { $pull: { products: { $in: productIds } } }
  );
  await Collection.updateMany(
    { products: { $in: productIds } },
    { $pull: { products: { $in: productIds } } }
  );

  // Delete all products in this category
  await Product.deleteMany({ _id: { $in: productIds } });

  // Clear products from the category
  category.products = [];
  await category.save();

  // Remove empty categories from user
  user.categories = user.categories.filter(
    (cat) =>
      cat.products.length > 0 && cat._id.toString() !== category._id.toString()
  );
  await user.save();

  req.flash("success", "successfully deleted category".toUpperCase());
  res.redirect("/categories");
};

module.exports = {
  index,
  deleteAllProductsInCategory,
};
