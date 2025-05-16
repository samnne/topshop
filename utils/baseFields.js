
const sessionOptions = {
    secret: "aquicksecret",
    resave: false,
    saveUninitialized: false
}
const categories = [
    "fruit",
    "vegetable",
    "dairy",
    "protein",
    "candy",
    "snacks",
    "household",
    "bakery",
    "beverages",
    "frozen",
    "meat",
    "seafood",
    "pantry",
    "condiments",
    "personal care",
    "cleaning",
    "baby",
    "pet",
    "health",
    "canned goods",
    "spices",
    "grains",
    "breakfast",
    "baking",
    "international"
]
module.exports = {
    categories, sessionOptions
}