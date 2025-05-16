const express = require("express")
const router = express.Router()
const Collection = require("../models/category")
const Product = require("../models/product")
const wrapAsync = require("../utils/wrapAsync")
const { avgPrice, calcTotal, roundToDecimal } = require("../utils/avgPrice")
const { categories } = require("../utils/baseFields")




const bcrypt = require("bcrypt")

const hashPass = async (pw) => {
    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(pw, salt)


}
const login = async (p2, hashedpw) => {
    const res = await bcrypt.compare(p2, hashedpw)
    if (res) console.log("logged in")
    else console.log("try again")
}
//hashPass("monkey")
login("monkey", "$2b$12$w1W5d6L1hfi3rjm.Yxg5ZunsipmRp4hdDMiyuwMWv2TM7k9GTjNxi")
async function createCollection() {
    const products = await Product.find({})
    await Collection.deleteMany({})
    for (let cat of categories) {
        const collection = new Collection({
            name: cat,
        })
        for (let product of products) {
            if (product.category === cat) {
                collection.products.push(product)
            }
        }
        collection.save()
    }
}

router.get("/", wrapAsync(async (req, res, next) => {
    //await createCollection()
    const products = await Product.find({})
    const collections = await Collection.find({})

    res.render("categories/index", { products, collections, round: roundToDecimal })
}))



// router.get("/greet", (req, res) => {
//     const { name = "No-name" } = req.cookies
//     const { username } = req.session;

//     res.send(`Welcome back ${username}`)
// })
// router.get("/setName", (req, res) => {
//     res.cookie("name", "Sams Chicken")
//     res.send("ok sent cookie")
// })

// router.get("/verifyfruit", (req, res) => {
//     console.log(req.cookies)
//     res.send(req.signedCookies)
// })

// router.get("/getsignedcookie", (req, res) => {
//     res.cookie("fruit", "grape", { signed: true })
//     res.send("SIGNED COOKIE")
// })

// router.get("/pageviews", (req, res) => {
//     if (req.session.count) req.session.count += 1
//     else req.session.count = 1
//     res.send(`YOU HAVE VIEWED THIS PAGE ${req.session.count} TIMES`)
// })

// router.get("/register", (req, res) => {
//     const { username = "Anonymous" } = req.query;
//     req.session.username = username;
//     res.redirect("/categories/greet")
// })


module.exports = router