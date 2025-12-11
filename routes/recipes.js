const router = require("express").Router();
const { index } = require("../controllers/recipes.js");

router.get("/", index);

module.exports = router;
