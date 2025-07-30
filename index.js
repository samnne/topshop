if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
app.set("query parser", "extended");
const mongoSanitize = require("./utils/mongoSanV5.js");
const path = require("path");
const PORT = process.env.PORT;
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products.js");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const User = require("./models/userSchema");

const helmet = require("helmet");
const MongoStore = require("connect-mongo")(session);
const { sessionOptions } = require("./utils/baseFields.js");

const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
};

const passport = require("passport");
const LocalStrategy = require("passport-local");
const AppError = require("./utils/AppError.js");

// const dbURL = process.env.LOCAL_DB_URL;
const dbURL = process.env.MONGO_DB_URL;

mongoose.set("strictQuery", true);
mongoose
  .connect(dbURL)
  .then(() => {
    console.log("MONGO CONNECTION OPENED");
  })
  .catch((e) => {
    console.log("MONGO Error", e);
  });

const store = new MongoStore({
  url: dbURL,
  touchAfter: 24 * 3600,
});

store.on("error", function (e) {
  console.log("Error", e);
});

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

app.use(cors(corsOptions));
app.use(cookieParser("thisissecret"));
app.use(session(sessionOptions));
app.use(flash());

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize({ replaceWith: "_" }));

app.use(passport.session());
app.use(passport.initialize());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/1bb4953290.js",

    "https://cdn.jsdelivr.net",

];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
 
];
const fontSrcUrls = [
    "https://fonts.gstatic.com/",
    "https://ka-f.fontawesome.com"
]
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
    connectSrc: ["'self'", "https://ka-f.fontawesome.com"], // <-- add this
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;

  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  console.log(err);
  if (!err.message) err.message = "Invalid";
  else if (err.message === "NotFound") {
    res
      .status(status)
      .render("products/notfound", {
        message: "Sorry, that page doesnt exist",
        subMessage: "Page Not Found",
        numberStatus: status,
      });
  } else if (err.message === "TypeError") {
    res
      .status(status)
      .render("products/notfound", {
        message: "AI error",
        subMessage: "Google Gemini couldnt connect!",
        numberStatus: status,
      });
  }
});

app.get("/", (req, res)=>{
  res.redirect("/categories")
})

app.all(/(.*)/, (err, req, res, next) => {
  next(new AppError("NotFound", 404));
});

app.listen(PORT, () => {
  console.log(`App is listening on PORT: ${PORT}`);
});
