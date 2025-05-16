const { default: mongoose } = require("mongoose");

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
    phone: {
        type: String
    }
})

const User = mongoose.model("User", userSchema)


module.exports = User