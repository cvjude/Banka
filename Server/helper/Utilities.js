/* eslint-disable linebreak-style */
import Joi from 'joi';

class Util {
  /**
  * @static
  * @description Validates an Object against the schema
  * @param {Object} validateObject - object to be validated
  * @param {Object} schemadata - Joi schema
  * @memberof Controllers
  */

  static validateJoi(validateObject, schemadata) {
    let error;
    Joi.validate(validateObject, schemadata, { convert: false }, (err) => {
      if (err) {
        error = err.details[0].message;
        error = error.replace(/"/gi, '');
        if (error.includes('[A-Za-z]')) { error = `${err.details[0].path[0]} should be a string`; }
      }
    });
    return error;
  }


  /**
  * @static
  * @description Returns message based on the status
  * @param {Object} res - Response object
  * @param {integer} statusCode - status code to be sent
  * @param {Object} errormessage - the appropraite error message
  * @memberof Controllers
  */

  static errorstatus(res, statusCode, errormessage) {
    return res.status(statusCode).json({
      status: statusCode,
      error: errormessage,
    });
  }
}

export default Util;
