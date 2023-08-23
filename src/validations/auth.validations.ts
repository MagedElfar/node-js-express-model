import Joi from "joi";

const signupSchema = Joi.object({

    name: Joi.string()
        .required()
        .messages({
            "string.min": "username must be at least 3 characters",
            "any.required": "username is required"
        }),

    password: Joi.string()
        .required()
        // .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
        .min(8)
        .max(16),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "invalid email format"
        })
})




const loginSchema = Joi.object({
    password: Joi.string()
        .required()
        .messages({
            "any.required": "Password is required"
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "any.required": "Email is required"
        })
})

const restPasswordEmailSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "any.required": "Email is required"
        })
})

const restPasswordSchema = Joi.object({
    password: Joi.string()
        .required()
        .min(8)
        .max(16),
})

const refreshTokenSchema = Joi.object({
    token: Joi.string()
        .required()
})

export {
    signupSchema,
    loginSchema,
    restPasswordEmailSchema,
    restPasswordSchema,
    refreshTokenSchema
}