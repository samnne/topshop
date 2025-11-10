const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
const isLoggedIn = (req, res, next) => {
    //console.log(req.user)
    if (!req.isAuthenticated()) {
        // Store the url requested 
        req.session.returnTo = req.originalUrl
        req.flash("error", "You must be signed in")
        return res.redirect("/login")
    }
    next()
}



module.exports = {storeReturnTo, isLoggedIn}