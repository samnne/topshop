const express = require("express")
const app = express()
const path = require("path")
const PORT = 3000
const ejsMate = require("ejs-mate")
const AppError = require("./utils/AppError")
const { avgPrice, calcTotal, roundToDecimal } = require("./utils/avgPrice")
const mongoose = require("mongoose");
const Product = require("./models/product")
const Collection = require("./models/category")
const methodOverride = require("method-override")
mongoose.set('strictQuery', true);


mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log("MONGO CONNECTION OPENED")
    }).catch((e) => {
        console.log("MONGO Error", e)
    });
app.engine("ejs", ejsMate)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

const categories = [
    "fruit",
    "vegetable",
    "dairy",
    "protein",
    "candy",
    "snacks",
    "household",
    "bakery",
    "beverages",
    "frozen",
    "meat",
    "seafood",
    "pantry",
    "condiments",
    "personal care",
    "cleaning",
    "baby",
    "pet",
    "health",
    "canned goods",
    "spices",
    "grains",
    "breakfast",
    "baking",
    "international"
]

async function createCollection() {
    const products = await Product.find({})
    await Collection.deleteMany({})
    for (let cat of categories) {
        const collection = new Collection({
            name: cat,
        })
        for (let product of products) {
            if (product.category === cat) {
                collection.products.push(product)
            }
        }
        collection.save()
    }

}

async function findToDelete(prods, id) {
    //await Collection.deleteMany({})
}

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

// CAT ROUTES

app.get("/categories", wrapAsync(async (req, res, next) => {
    //await createCollection()
    const products = await Product.find({})
    const collections = await Collection.find({})
    res.render("categories/index", { products, collections, round: roundToDecimal })
}))



// PRODUCT ROUTES

app.get("/products", wrapAsync(async (req, res) => {
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
app.get("/products/new", (req, res) => {

    res.render("products/new", { categories })
})
app.post("/products", wrapAsync(async (req, res) => {
    //const { name, price, category } = req.body
    req.body.price = 0
    const newProduct = new Product(req.body)

    const collection = await Collection.findOne({ name: newProduct.category })
    collection.products.push(newProduct)
    await newProduct.save();
    await collection.save()
    await avgPrice(newProduct)
    res.redirect(`/products/${newProduct._id}`)
}))

app.delete("/products", wrapAsync(async (req, res) => {
    await Product.deleteMany({})
    res.redirect(`/products`)
}))



app.get("/products/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params

    const product = await Product.findById(id)
    if (!product) {
        throw new AppError("products/notfound", 404)
    }
    res.render("products/show", { product })
}))
app.get("/products/new/:id/edit", wrapAsync(async (req, res, next) => {
    const { id } = req.params

    const product = await Product.findById(id)
    if (!product) {
        throw new AppError("products/notfound", 404)
    }
    res.render("products/edit", { product, categories })


}))

app.put("/products/:id/", wrapAsync(async (req, res) => {
    const { id } = req.params
    if (!req.body.buy) {
        req.body.buy = "off"
    }
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    await avgPrice(product)
    res.redirect(`/products/${product.id}`)

}))

app.delete("/products/:id", wrapAsync(async (req, res) => {
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

app.all(/(.*)/, (req, res, next) => {

    next(new AppError("products/notfound", 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err
    console.log(err)
    if (!err.message) err.message = "Invalid"
    res.status(status).render("products/notfound")
})

app.listen(PORT, () => {
    console.log(`App is listening on PORT: ${PORT}`)
})