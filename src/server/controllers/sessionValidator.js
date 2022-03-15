const { Joi } = require("express-validation");

const validationSessionJoi = {
  body: Joi.object({
    title: Joi.string().required(),
    date: Joi.date().default(new Date()),
    comment: Joi.string().required(),
    iFrame: Joi.string().required(),
  }),
};

module.exports = validationSessionJoi;
