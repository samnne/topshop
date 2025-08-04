const Joi = require("joi")

module.exports.userSchema = Joi.object({
    user: Joi.object({
        name: Joi.string(),
        username: Joi.string().required(),
        password: Joi.string().min(6),
        email: Joi.string().required(),
        birthday: Joi.string()
    }).required()
})
module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string(),
        qty: Joi.number().required(),
        buy: Joi.string(),
        category: Joi.string().required(),
        owner: Joi.object().required()

    }).required()
})