const express = require("express");
const router = express.Router();

const User = require("../models/userSchema");
const AppError = require("../utils/AppError");
const passport = require("passport");

const {  isLoggedIn } = require("../middlewares");
const {
  renderRegisterForm,
  registerUser,
  renderLoginForm,
  loginUser,
  logoutUser,
  renderAccount,
  editUser,
} = require("../controllers/users");
const GoogleStrategy = require("passport-google-oauth20");

const {userSchema} = require("../schemas")
const validateSchema = ((req, res, next) => {
    const user = {user: req.body}
    const { error } = userSchema.validate(user)
    if (error) {
        const msg = error.details.map(el => el.message).join(
            ","
        )
        throw new AppError(msg, 400)
    } else {
        next()
    }
})
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/oauth2/redirect/google",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find the user by Google ID
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // If not found, create a new user
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName || profile.emails[0].value,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined,
            // Add other fields as needed
          });
        }
       
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

router.get("/register", renderRegisterForm);
router.post("/register", validateSchema, registerUser);
router.get("/login", renderLoginForm);
router.get(
  "/login/federated/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/categories',
  failureRedirect: '/login'
}));
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  loginUser
);
router.post("/logout", isLoggedIn, logoutUser);
router.get("/account", isLoggedIn, renderAccount);
router.post("/account/editUser/:id", isLoggedIn, validateSchema, editUser)
module.exports = router;
