const mongoose = require("mongoose")
const Product = require("./product")

const { Schema } = mongoose

const collectionSchema = new Schema({
    name: {
        type: String,
        required: [true, "each item should have a category"]
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const Collection = mongoose.model('collection', collectionSchema);

module.exports = Collection;