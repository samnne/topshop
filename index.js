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
const wrapAsync = require("./utils/wrapAsync.js")
const User = require("./models/userSchema")
const bcrypt = require("bcrypt")
const sessionOptions = {
    secret: "aquicksecret",
    resave: false,
    saveUninitialized: false,
    cookies: {
        expires: Date.now() * 1000 * 30,
        maxAge: 1000 * 30
    }
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

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        req.flash("error", "Please log in".toUpperCase())
        return res.redirect("/login")
    }
    next()
}


app.use("/categories", categoryRoutes)
app.use("/products", productRoutes)







app.get("/register", wrapAsync(async (req, res) => {

    res.render("register/signup")
}))

app.post("/register", wrapAsync(async (req, res) => {
    const { name, username, password, email } = req.body

    const user = new User({
        username,
        password,
        email,
        name
    })
    await user.save()
    req.session.user_id = user._id
    res.redirect("/categories")
}))
app.get("/login", wrapAsync(async (req, res) => {
    res.render("register/login")
}))
app.post("/login", wrapAsync(async (req, res) => {
    const { password, username } = req.body
    const foundUser = await User.authenticateUser(username, password)
    if (foundUser._id) {
        req.session.user_id = foundUser._id
        req.flash("success", "successfully logged in".toUpperCase())
        res.redirect("/categories")
    } else {
        res.redirect("/login")
    }

}))
app.post("/logout", (req, res) => {
    req.session.user_id = null
    res.redirect("/account")
})

app.get("/account", requireLogin, wrapAsync(async (req, res) => {

    res.render("register/account")
}))
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