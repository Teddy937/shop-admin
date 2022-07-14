import { Joi } from "express-validation";

export const productValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().required()

})