const mongoose = require("mongoose");
const Product = require("./models/product")

mongoose.set('strictQuery', true);


mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log("MONGO CONNECTION OPENED")
    }).catch((e) => {
        console.log("MONGO Error", e)
    });




// p.save()
// .then(person => console.log(person))
// .catch(err => console.log("OH NO ERROR", err))
//AIzaSyCgcUGIy4USCtPWqO9T45u-DjnegIiR-IA
const products = [
    // Existing products (fruit, vegetable, dairy) ...
    { name: "Ruby Grapefruit", price: "1.00-2.00", category: "fruit", buy: "on" },
    { name: "Banana", price: "0.50-1.00", category: "fruit", buy: "on" },
    { name: "Strawberry", price: "2.00-3.50", category: "fruit", buy: "on" },
    { name: "Apple", price: "1.00-2.00", category: "fruit", buy: "on" },
    { name: "Carrot", price: "0.50-1.50", category: "vegetable", buy: "on" },
    { name: "Broccoli", price: "1.00-2.50", category: "vegetable", buy: "on" },
    { name: "Spinach", price: "0.80-1.50", category: "vegetable", buy: "on" },
    { name: "Potato", price: "0.60-1.20", category: "vegetable", buy: "on" },
    { name: "Milk", price: "2.00-3.00", category: "dairy", buy: "on" },
    { name: "Cheddar Cheese", price: "3.00-5.00", category: "dairy", buy: "on" },
    { name: "Yogurt", price: "1.00-2.00", category: "dairy", buy: "on" },
    { name: "Butter", price: "2.00-3.50", category: "dairy", buy: "on" },

    // New categories & products below:

    { name: "Chicken Breast", price: "4.00-7.00", category: "meat", buy: "on" },
    { name: "Salmon Fillet", price: "6.00-10.00", category: "seafood", buy: "on" },
    { name: "Toilet Paper (12-pack)", price: "5.00-8.00", category: "household", buy: "on" },
    { name: "Chocolate Bar", price: "1.00-2.50", category: "candy", buy: "on" },
    { name: "Potato Chips", price: "2.00-4.00", category: "snacks", buy: "on" },
    { name: "Shampoo", price: "3.50-6.00", category: "personal care", buy: "on" },
    { name: "Cereal", price: "3.00-5.50", category: "breakfast", buy: "on" }
];


// Assign random qty to each product
products.forEach(product => {
    product.qty = Math.floor(Math.random() * 3) + 1;
});



const validInsert = async () => {

    await Product.deleteMany({})

    const newProducts = []
    for (let p of products) {
        try {
            let product = await Product.findOne({ name: p.name })
            if (!product) {
                Product.insertOne(p)
                    .then(res => console.log("it inserted"))
                    .catch(err => console.log("it failed man", err))
            }
        } catch (e) {
            console.log("Client Error 500")
        }
    }

}


validInsert()
