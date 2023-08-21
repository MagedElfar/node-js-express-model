import Joi from "joi";

const updateSchema = Joi.object({

    name: Joi.string().optional(),

    email: Joi.string().email().required(),
})

export {
    updateSchema
}