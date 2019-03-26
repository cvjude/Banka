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
};

export default schema;
