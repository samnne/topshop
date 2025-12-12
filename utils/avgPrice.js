const { GoogleGenAI } = require("@google/genai");
const Product = require("../models/product");
const AppError = require("./AppError");

const question = (theName) => {
  return `
  Whats the best range price of the average price and keep the lower and upper limit
  as close as possible for ${theName} and give just the number (can be float) 
  eg. 1.99-2.99 and for the accurancy make sure its within a +/- $2-3 differnece for both low and high end range
  do NOT put the dollar sign in your response from general supermarkets 
  (Walmart, No Frills, Loblaws, etc.) (The price should be in CAD dollars) `;
};
async function avgPrice(product, next, req) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: question(product.name),
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "string",
        },
      },
    });
    const price = response.text;
    let newPrice = "";
    for (let i = 0; i < price.length; i++) {
      if (price[i] === `"`) continue;
      newPrice += price[i];
    }

    const updatedProduct = await Product.findByIdAndUpdate(product._id, {
      price: newPrice,
    });
    console.log("worked");
  } catch (err) {
    console.log("reached error", err);
    req.flash("error", "Error when computing a price!".toUpperCase());
    next(new AppError(err.message, err.code));
  }
}
function roundToDecimal(number, decimals = 2) {
  const factor = 10 ** decimals;
  // console.log(Math.round(number * factor) / factor)
  return Math.round(number * factor) / factor;
}

function scanPrice(price) {
  let dash = "-";
  let found = false;
  let lowerLimit = "";
  let upperLimit = "";
  for (let i = 0; i < price.length; i++) {
    if (price[i] === `"`) continue;
    if (price[i] === dash) {
      found = true;
      continue;
    }
    if (found) {
      upperLimit += price[i];
    } else {
      lowerLimit += price[i];
    }
  }

  lowerLimit = roundToDecimal(parseFloat(lowerLimit));
  upperLimit = roundToDecimal(parseFloat(upperLimit));
  return `${lowerLimit}-${upperLimit}`;
}

function calcTotal(allProducts = []) {

  let lowerLimit = 0
  let upperLimit = 0
  try {
    for (let cur of allProducts) {
      if (cur.buy === "on") {
        let price = scanPrice(cur.price);
        let dash = "-"
        lowerLimit += parseFloat(price.split(dash)[0]) * cur.qty 
        upperLimit += parseFloat(price.split(dash)[1]) * cur.qty 

        // console.log(`price: ${price} lower upper: ${lowerLimit} ${upperLimit}`)
        
      }
    }
  } catch (error) {
    console.log(error);
  }
  //console.log(totalSum, upperLimit)
  return `${lowerLimit}-${upperLimit}`;
}

module.exports = { avgPrice, calcTotal, roundToDecimal, scanPrice };
