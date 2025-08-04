const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/userSchema");

// Controller functions

const renderRegisterForm = wrapAsync(async (req, res) => {
  res.render("register/signup");
});

const registerUser = async (req, res) => {
  try {
    const { email, username, password, name } = req.body;
    const user = new User({ email, username, name });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to TopShop!");
      res.redirect("/categories");
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/register");
  }
};

const renderLoginForm = wrapAsync(async (req, res) => {
  res.render("register/login");
});

const loginUser = async (req, res) => {
  req.flash("success", "Welcome back");
  const redirectUrl = res.locals.returnTo || "/account";
  delete req.session.returnTo;
  const url_array = req.query;

  const { react, username, password } = url_array;
  if (react === "true") {
    const user = await User.findOne({ username })
      .populate("products")
      .populate("categories");
    return res.json(user);
  } else {
    res.redirect("/products");
  }
};

const logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/categories");
  });
};

const renderAccount = wrapAsync(async (req, res) => {
  const curUser = res.locals.currentUser ? res.locals.currentUser : null;
  const user = await User.findByUsername(curUser?.username);
  res.render("register/account", { user });
});

const editUser = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { username, email, birthday, password: newPassword } = req.body;

  const user = await User.findById(id);
  user.birthday = birthday;
  if (username !== user.username) user.username = username;
  if (email !== user.email) user.email = email;

  try {
    if (newPassword) {
      await user.setPassword(newPassword);
    } 
    await user.save();
    res.redirect("/account");
  } catch (err) {
    req.flash("error", "Password change failed: " + err.message);
    res.redirect("/account");
  }
  res.redirect("/account");
});

// Routes

module.exports = {
  renderRegisterForm,
  registerUser,
  renderLoginForm,
  loginUser,
  logoutUser,
  renderAccount,
  editUser,
};
