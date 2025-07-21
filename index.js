const express = require("express")
const app = express()
const path = require("path")
const PORT = 5000
const ejsMate = require("ejs-mate")
const mongoose = require("mongoose");
const methodOverride = require("method-override")
const userRoutes = require("./routes/users")
const categoryRoutes = require("./routes/categories")
const productRoutes = require("./routes/products.js")
const flash = require("connect-flash")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const User = require("./models/userSchema");



const passport = require("passport")
const LocalStrategy = require("passport-local")
const AppError = require("./utils/AppError.js")

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



app.use(passport.session())
app.use(passport.initialize())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {

    res.locals.currentUser = req.user

    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

app.use("/", userRoutes)
app.use("/categories", categoryRoutes)
app.use("/products", productRoutes)




app.use((err, req, res, next) => {
    const { status = 500 } = err
    console.log(err)
    if (!err.message) err.message = "Invalid"
    else if (err.message === "NotFound") {
        res.status(status).render("products/notfound", { message: "Sorry, that page doesnt exist", subMessage: "Page Not Found", numberStatus: status })
    }
    else {
        res.status(status).render("products/notfound", { message: "Sorry, we do not have that product", subMessage: "Could Not Find", numberStatus: status })
    }
})

app.all(/(.*)/, (req, res, next) => {
    next(new AppError("NotFound", 404))
})

app.listen(PORT, () => {
    console.log(`App is listening on PORT: ${PORT}`)
})