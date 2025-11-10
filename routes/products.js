const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn } = require("../middlewares");

const { productSchema } = require("../schemas");

const {
  index,
  renderNewProductForm,
  createNewProduct,
  deleteAllProducts,
  showProduct,
  renderEditProductForm,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const AppError = require("../utils/AppError");

const validateProduct = (req, res, next) => {
  const product = { product: req.body };
  const curUser = res.locals.currentUser ? res.locals.currentUser : null;
  
  product.product.owner = curUser

  const { error } = productSchema.validate(product);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

router
  .route("/")
  .get(wrapAsync(index))
  .post(isLoggedIn, validateProduct, wrapAsync(createNewProduct));

router.route("/new").get(isLoggedIn, renderNewProductForm);

router.get("/:id", isLoggedIn, wrapAsync(showProduct));
router.get("/new/:id/edit", isLoggedIn, wrapAsync(renderEditProductForm));

router.put("/:id/", isLoggedIn, validateProduct, wrapAsync(updateProduct));

router.delete("/:id", isLoggedIn, wrapAsync(deleteProduct));

module.exports = router;
