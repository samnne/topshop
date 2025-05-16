const mongoose = require("mongoose")
const { Schema } = mongoose
const productSchema = Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: [
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

    },
    buy: {

        type: String

    },
    qty: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product