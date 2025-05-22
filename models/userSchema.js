const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        min: 6,
        required: true
    },
    name: {
        type: String
    },
    email: {
        type: String
    },

})
userSchema.statics.authenticateUser = async function (username, password) {
    const foundUser = await this.findOne({ username })
    const isValid = await bcrypt.compare(password, foundUser.password)

    return isValid ? foundUser : false
}

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})
const User = mongoose.model("User", userSchema)


module.exports = User