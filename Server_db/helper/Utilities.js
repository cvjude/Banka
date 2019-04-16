/* eslint-disable linebreak-style */
import Joi from 'joi';

class Util {
  /**
  * @static
  * @description Validates an Object against the schema
  * @param {Object} validateObject - object to be validated
  * @param {Object} schemaData - Joi schema
  * @memberof Controllers
  */

  static validateJoi(validateObject, schemaData) {
    let error;
    Joi.validate(validateObject, schemaData, { convert: false }, (err) => {
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
  * @param {Object} errorMessage - the appropraite error message
  * @memberof Controllers
  */

  static errorstatus(res, statusCode, errorMessage) {
    return res.status(statusCode).json({
      status: statusCode,
      error: errorMessage,
    });
  }

  /**
  * @static
  * @description Returns message based on the status
  * @param {Object} res - Response object
  * @param {integer} statusCode - status code to be sent
  * @param {Object} errorMessage - the appropraite error message
  * @memberof Controllers
  */

  static successStatus(res, status, key, object) {
    const response = { status };
    response[key] = object;

    return res.status(status).json(response);
  }
}

export default Util;
