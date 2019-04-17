import Joi from 'joi';

const schema = {
  signup: Joi.object().keys({
    firstName: Joi.string().trim().regex(/[A-Za-z]/).min(3)
      .required(),
    lastName: Joi.string().regex(/[A-Za-z]/).trim().min(3)
      .required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.required(),
  }),

  signin: Joi.object().keys({
    email: Joi.string().email().lowercase().required(),
    password: Joi.required(),
  }),

  account: Joi.object().keys({
    type: Joi.string().trim().valid('savings', 'current')
      .required(),
    openingBalance: Joi.number().required(),
  }),

  setAccount: Joi.object().keys({
    status: Joi.string().trim().valid('active', 'dormant')
      .required(),
    accountNumber: Joi.number().integer().required().min(10),
  }),

  checkAccount: Joi.object().keys({
    accountNumber: Joi.number().min(10).integer().required(),
  }),
};

export default schema;
