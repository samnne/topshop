const express = require("express")
const app = express()
const path = require("path")
const PORT = 5000
const ejsMate = require("ejs-mate")
const AppError = require("./utils/AppError")
const mongoose = require("mongoose");
const methodOverride = require("method-override")
const categoryRoutes = require("./routes/categories")
const productRoutes = require("./routes/products.js")
const flash = require("connect-flash")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const sessionOptions = {
    secret: "aquicksecret",
    resave: false,
    saveUninitialized: false
}

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/shoppingList')
    .then(() => {
        console.log("MONGO CONNECTION OPENED")
    }).catch((e) => {
        console.log("MONGO Error", e)
    });

app.use(cookieParser('thisissecret'))
app.use(session(sessionOptions))
app.use(flash())
app.engine("ejs", ejsMate)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})
app.use("/categories", categoryRoutes)
app.use("/products", productRoutes)


app.all(/(.*)/, (req, res, next) => {

    next(new AppError("NotFound", 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err
    console.log(err.message)
    if (!err.message) err.message = "Invalid"
    else if (err.message === "NotFound") res.status(status).render("products/notfound", { message: "Sorry, that page doesnt exist", subMessage: "Page Not Found", numberStatus: status })
    else res.status(status).render("products/notfound", { message: "Sorry, we do not have that product", subMessage: "Could Not Find", numberStatus: status })
})

app.listen(PORT, () => {
    console.log(`App is listening on PORT: ${PORT}`)
})