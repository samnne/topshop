const { default: mongoose, Schema } = require("mongoose");
const bcrypt = require("bcrypt")

const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        min: 6,
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: "collection"
        }
    ],
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]

})
// userSchema.statics.authenticateUser = async function (username, password) {
//     const foundUser = await this.findOne({ username })
//     const isValid = await bcrypt.compare(password, foundUser.password)

//     return isValid ? foundUser : false
// }

// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next()
//     this.password = await bcrypt.hash(this.password, 12)
//     next()
// })
userSchema.plugin(passportLocalMongoose)
const User = mongoose.model("User", userSchema)


module.exports = User