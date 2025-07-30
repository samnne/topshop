
const Product = require("../models/product");
const Collection = require("../models/category");
const { avgPrice, calcTotal, roundToDecimal } = require("../utils/avgPrice");
const { categories } = require("../utils/baseFields");

const User = require("../models/userSchema");


const index = async (req, res) => {
    const { category } = req.query;
    const curUser = res.locals.currentUser;
    const user = await User.findByUsername(curUser ? curUser.username : "")
      .populate("products")
      .populate("categories");

    if (category) {
   
      const newProds = user ? user.products.filter((prod) => prod.category === category) : [];
        const newSum = calcTotal(newProds)
    
      res.render("products/index", {
        user,
        products: newProds,
        category,
        sum: newSum,
        round: roundToDecimal,
      });
    } else {
      const sum = calcTotal(user ? user.products : []);
     // res.json(ps)
      res.render("products/index", {
        user,
        products: user ? user.products : [],
        category: "All",
        sum,
        round: roundToDecimal,
      });
    }
  }
const renderNewProductForm = (req, res) => {
    res.render("products/new", { categories });
};

const createNewProduct = async (req, res, next) => {
    req.body.price = 0;
    const curUser = res.locals.currentUser;
    const newProduct = new Product(req.body);
    newProduct.owner = curUser;

    const collection = await Collection.findOne({ name: newProduct.category });
    collection.products.push(newProduct);

    if (curUser === null) return res.redirect("/login");
    const user = await User.findByUsername(curUser.username)
        .populate("products")
        .populate("categories");

    if (!user.categories.some(cat => cat.name === newProduct.category)) {
        user.categories.push(collection);
    }
    user.products.push(newProduct);

    await newProduct.save();
    //await avgPrice(newProduct, next);
    
    await collection.save();
    await user.save();
    req.flash("success", "successfully made product".toUpperCase());
    res.redirect(`/products/${newProduct._id}`);
};

const deleteAllProducts = async (req, res) => {
    await Product.deleteMany({});
    res.redirect(`/products`);
};

const showProduct = async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        req.flash("error", "Cannot find that product!");
        return res.redirect("/products");
    }
    res.render("products/show", { product });
};

const renderEditProductForm = async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        throw new AppError("products/notfound", 404);
    }
    res.render("products/edit", { product, categories });
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    if (!req.body.buy) {
        req.body.buy = "off";
    }
    const product = await Product.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });
    
    req.flash("success", "successfully edited product".toUpperCase());
    res.redirect(`/products/${product.id}`);
};

const deleteProduct = async (req, res) => {
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
};


module.exports = {
    index, 
    renderEditProductForm,
    renderNewProductForm,
    deleteAllProducts,
    deleteProduct,
    showProduct, 
    updateProduct, createNewProduct
}