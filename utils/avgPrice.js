const gemini = require("@google/genai")
const Product = require("../models/product")
const ai = new gemini.GoogleGenAI({ apiKey: "AIzaSyCgcUGIy4USCtPWqO9T45u-DjnegIiR-IA" });
const question = (theName) => {
    return `Whats the best range price of the average price and keep the lower and upper limit as close as possible for ${theName} and give just the number (can be float) do NOT put curly braces in between it eg. {1.99-2.99} do NOT put the dollar sign in your response from general supermarkets (Walmart, No Frills, Loblaws, etc.) (The price should be in CAD dollars) `
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
    //     
    //     }, 2000)
    // }
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: question(product.name)
    });
    const newPrice = response.text
    const updatedProduct = await Product.findByIdAndUpdate(product._id, { price: newPrice })

}
function roundToDecimal(number, decimals = 2) {
    const factor = 10 ** decimals;
    // console.log(Math.round(number * factor) / factor)
    return Math.round(number * factor) / factor;
}
function calcTotal(allProducts = []) {
    let totalSum = ''
    let lowerLimit = 0
    let upperLimit = 0
    allProducts.forEach((cur) => {

        lowerLimit += parseFloat(cur.price.slice(0, 4)) * cur.qty
        upperLimit += parseFloat((cur.price.slice(5, cur.price.length)) * cur.qty)
        //console.log(`price: ${cur.price} lower upper: ${lowerLimit} ${upperLimit}`)

    })
    totalSum = `${roundToDecimal(lowerLimit)}-${roundToDecimal(upperLimit)}`

    // console.log(totalSum, upperLimit)
    return totalSum
}


module.exports = { avgPrice, calcTotal, roundToDecimal }