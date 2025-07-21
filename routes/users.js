const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const User = require("../models/userSchema")
const AppError = require("../utils/AppError")
const passport = require("passport")
const flash = require("connect-flash")
const session = require("express-session")
const { storeReturnTo, isLoggedIn } = require("../middlewares")



router.get("/register", wrapAsync(async (req, res) => {

    res.render("register/signup")
}))


router.post("/register", async (req, res) => {
    try {
        const { email, username, password, name } = req.body
        const user = new User({ email, username, name })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash("success", "Welcome to TopShop!")
            res.redirect("/categories")
        })
    } catch (e) {
        req.flash("error", e.message)
        return res.redirect("/register")
    }

})

// router.post("/register", wrapAsync(async (req, res) => {
//     const { name, username, password, email } = req.body

//     const user = new User({
//         username,
//         password,
//         email,
//         name
//     })
//     await user.save()
//     req.session.user_id = user._id
//     res.redirect("/categories")
// }))
router.get("/login", wrapAsync(async (req, res) => {
    res.render("register/login")
}))

router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome back")
    const redirectUrl = res.locals.returnTo || "/account"
    delete req.session.returnTo
    res.redirect(redirectUrl)
})



router.post("/logout", isLoggedIn, (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/categories');
    });
})

router.get("/account", isLoggedIn, wrapAsync(async (req, res) => {
    res.render("register/account")
}))


module.exports = router