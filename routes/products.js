const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const Product = require("../models/product")
const Collection = require("../models/category")
const { avgPrice, calcTotal, roundToDecimal } = require("../utils/avgPrice")
const { categories, sessionOptions } = require("../utils/baseFields")
const session = require("express-session")
const flash = require("connect-flash")
router.use(session(sessionOptions))
router.use(flash())
router.use((req, res, next) => {
    res.locals.messages = req.flash("success")
    next()
})
router.get("/", wrapAsync(async (req, res) => {
    const { category } = req.query

    if (category) {
        const products = await Product.find({ category })
        const sum = calcTotal(products)
        res.render("products/index", { products, category, sum, round: roundToDecimal })
    } else {
        const products = await Product.find({})
        const sum = calcTotal(products)
        res.render("products/index", { products, category: "All", sum, round: roundToDecimal })
    }
}))
router.get("/new", (req, res) => {

    res.render("products/new", { categories })
})
router.post("/", wrapAsync(async (req, res) => {
    //const { name, price, category } = req.body
    req.body.price = 0
    const newProduct = new Product(req.body)

    const collection = await Collection.findOne({ name: newProduct.category })
    collection.products.push(newProduct)
    await newProduct.save();
    await collection.save()
    await avgPrice(newProduct)
    req.flash("success", "succesfully made product".toUpperCase())
    res.redirect(`/products/${newProduct._id}`)
}))

router.delete("/", wrapAsync(async (req, res) => {
    await Product.deleteMany({})
    res.redirect(`/products`)
}))



router.get("/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params

    const product = await Product.findById(id)
    if (!product) {
        throw new AppError("products/notfound", 404)
    }
    res.render("products/show", { product })
}))
router.get("/new/:id/edit", wrapAsync(async (req, res, next) => {
    const { id } = req.params

    const product = await Product.findById(id)
    if (!product) {
        throw new AppError("products/notfound", 404)
    }
    res.render("products/edit", { product, categories })


}))

router.put("/:id/", wrapAsync(async (req, res) => {
    const { id } = req.params
    if (!req.body.buy) {
        req.body.buy = "off"
    }
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    await avgPrice(product)
    res.redirect(`/products/${product.id}`)

}))

router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params


    const deletedProduct = await Product.findByIdAndDelete(id)

    await Collection.updateMany(
        { products: deletedProduct._id },
        {
            $pull: { products: deletedProduct._id }, $inc: { length: -1 }
        }
    );
    res.redirect(`/products`)

}))

module.exports = router