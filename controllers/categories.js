
const { roundToDecimal } = require("../utils/avgPrice");

const User = require("../models/userSchema");




const index = async (req, res, next) => {
  //await createCollection()
  const curUser = res.locals.currentUser ? res.locals.currentUser : null;
  if (curUser === null) return res.redirect("/login");
  const user = await User.findByUsername(curUser.username).populate({
    path: "categories",
    populate: [{ path: "products" }, { path: "owner" }],
  });
  console.log(user.categories);
  res.render("categories/index", {
    user,
    collections: user.categories,
    round: roundToDecimal,
  });
};

module.exports = {
  index,
};
