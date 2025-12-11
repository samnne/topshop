const { categories } = require("./baseFields");

const navLinks = [
  {
    name: "Categories",
    link: "categories",
    icon: "fa-solid fa-box-open",
  },
  {
    name: "Products",
    link: "products",
    icon: "fa-solid fa-basket-shopping",
  },
  // {
  //   name: "Recipes",
  //   link: "recipes",
  //   icon: "fa-regular fa-clipboard",
  // },
];


const allIcons = [
  { name: "fruit", icon: "fa-apple-alt" },
  { name: "vegetable", icon: "fa-carrot" },
  { name: "dairy", icon: "fa-cheese" },
  { name: "protein", icon: "fa-egg" },
  { name: "candy", icon: "fa-lollipop" },
  { name: "snacks", icon: "fa-cookie" },
  { name: "household", icon: "fa-home" },
  { name: "bakery", icon: "fa-bread-slice" },
  { name: "beverages", icon: "fa-cup" },
  { name: "frozen", icon: "fa-snowflake" },
  { name: "meat", icon: "fa-drumstick-bite" },
  { name: "seafood", icon: "fa-fish" },
  { name: "pantry", icon: "fa-box" },
  { name: "condiments", icon: "fa-bottle" },
  { name: "personal care", icon: "fa-soap" },
  { name: "cleaning", icon: "fa-broom" },
  { name: "baby", icon: "fa-baby" },
  { name: "pet", icon: "fa-paw" },
  { name: "health", icon: "fa-capsules" },
  { name: "canned goods", icon: "fa-jar" },
  { name: "spices", icon: "fa-flask" },
  { name: "grains", icon: "fa-wheat" },
  { name: "breakfast", icon: "fa-pancakes" },
  { name: "baking", icon: "fa-mortar-pestle" },
  { name: "international", icon: "fa-globe" },
];

module.exports = {
  navLinks,
  allIcons
}
