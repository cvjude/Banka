import Joi from 'joi';

const schema = {
  signup: Joi.object().keys({
    firstName: Joi.string().regex(/[A-Za-z]/).min(3)
      .required(),
    lastName: Joi.string().regex(/[A-Za-z]/).min(3)
      .required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  }),

  signin: Joi.object().keys({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  }),

  account: Joi.object().keys({
    type: Joi.string().valid('savings', 'current')
      .required(),
    openingBalance: Joi.number().required(),
  }),

  setAccount: Joi.object().keys({
    status: Joi.string().valid('active', 'dormant')
      .required(),
    accountNumber: Joi.number().integer().required().min(10),
  }),

  checkParam: Joi.object().keys({
    param: Joi.number().integer().required(),
  }),

  email: Joi.object().keys({
    email: Joi.string().email().lowercase().required(),
  }),

  transaction: Joi.object().keys({
    amount: Joi.number().required(),
    accountNumber: Joi.number().integer().required().min(10),
  }),
};

export default schema;
