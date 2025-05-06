const gemini = require("@google/genai")
const Product = require("../models/product")
const ai = new gemini.GoogleGenAI({ apiKey: "AIzaSyCgcUGIy4USCtPWqO9T45u-DjnegIiR-IA" });
const question = (theName) => {
    return `Whats the best guessed price of the average price for ${theName} and give just the number (can be float) do NOT put curly braces in between it eg. {1.92} do NOT put the dollar sign in your response from general supermarkets (Walmart, No Frills, Loblaws, etc.) (The price should be in CAD dollars) `
}
async function avgPrice(product) {
    // for (let p of allProducts) {
    //     setTimeout(async () => {
    //         const response = await ai.models.generateContent({
    //             model: "gemini-2.0-flash",
    //             contents: question(p.name)
    //         });
    //         const newPrice = parseFloat(response.text)
    //         const product = await Product.findByIdAndUpdate(p._id, { price: newPrice })
    //         console.log(product)
    //     }, 2000)
    // }
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: question(product.name)
    });
    const newPrice = parseFloat(response.text)

    const updatedProduct = await Product.findByIdAndUpdate(product._id, { price: newPrice })

    console.log(product)

}
function roundToDecimal(number, decimals) {
    const factor = 10 ** decimals;
    return Math.round(number * factor) / factor;
}
function calcTotal(allProducts = []) {
    let totalSum = 0
    allProducts.forEach((cur) => {
        if (cur.buy === "on") {
            totalSum += (cur.price * cur.qty)
        }
    })
    return roundToDecimal(totalSum, 2)
}


module.exports = { avgPrice, calcTotal, roundToDecimal }