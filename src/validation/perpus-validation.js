import Joi from "joi";


const createPerpusValidation = Joi.object({
    title: Joi.string().max(100).required(),
    author: Joi.string().max(100).optional(),
    publication_year: Joi.string().max(300).optional(),
    genre: Joi.string().max(20).optional()
});

const getPerpusValidation = Joi.number().positive().required();

const updatePerpusValidation = Joi.object({
    id: Joi.number().positive().required(),
    title: Joi.string().max(100).required(),
    author: Joi.string().max(100).optional(),
    publication_year: Joi.string().max(300).optional(),
    genre: Joi.string().max(20).optional()
});

const searchPerpusValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    title: Joi.string().optional(),
    author: Joi.string().optional(),
    publication_year : Joi.string().optional(),
    genre : Joi.string().optional()
})

export {
    createPerpusValidation,
    getPerpusValidation,
    updatePerpusValidation,
    searchPerpusValidation
}
