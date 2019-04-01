import Joi from 'joi';

const schema = {
  signup: Joi.object().keys({
    firstname: Joi.string().trim().regex(/[A-Za-z]/).min(3)
      .required(),
    lastname: Joi.string().regex(/[A-Za-z]/).trim().min(3)
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
    balance: Joi.number().required(),
  }),

  setAccount: Joi.object().keys({
    status: Joi.string().trim().valid('active', 'dormant')
      .required(),
    accountnumber: Joi.number().required().min(10),
  }),
};

export default schema;
