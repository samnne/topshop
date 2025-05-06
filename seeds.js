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
    {
        name: "Ruby Grapefruit",
        price: 1.99,
        category: "fruit",
        buy: "on"
    },
    {
        name: "Banana",
        price: 0.99,
        category: "fruit",
        buy: "on"
    },
    {
        name: "Strawberry",
        price: 2.99,
        category: "fruit",
        buy: "on"
    },
    {
        name: "Apple",
        price: 1.49,
        category: "fruit",
        buy: "on"
    },
    {
        name: "Carrot",
        price: 0.89,
        category: "vegetable",
        buy: "on"
    },
    {
        name: "Broccoli",
        price: 1.29,
        category: "vegetable",
        buy: "on"
    },
    {
        name: "Spinach",
        price: 1.19,
        category: "vegetable",
        buy: "on"
    },
    {
        name: "Potato",
        price: 0.79,
        category: "vegetable",
        buy: "on"
    },
    {
        name: "Milk",
        price: 2.49,
        category: "dairy",
        buy: "on"
    },
    {
        name: "Cheddar Cheese",
        price: 3.99,
        category: "dairy",
        buy: "on"
    },
    {
        name: "Yogurt",
        price: 1.59,
        category: "dairy",
        buy: "on"
    },
    {
        name: "Butter",
        price: 2.99,
        category: "dairy",
        buy: "on"
    }
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
