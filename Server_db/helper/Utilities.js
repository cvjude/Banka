/* eslint-disable linebreak-style */
import Joi from 'joi';

class Util {
  /**
  * @static
  * @description Validates an Object against the schema
  * @param {Object} validateObject - object to be validated
  * @param {Object} schemaData - Joi schema
  * @memberof Utilities
  */

  static validateJoi(validateObject, schemaData) {
    let error;
    Joi.validate(validateObject, schemaData, { abortEarly: false }, (err) => {
      if (err) {
        error = err.details;
        error = error.map((singleErrors) => {
          let { message } = singleErrors;
          message = message.replace(/"/gi, '');
          if (message.includes('[A-Za-z]')) {
            message = `${singleErrors.path[0]} should be a string`;
          }
          return message;
        });
      }
    });
    return error;
  }


  /**
  * @static
  * @description Returns message based on the status
  * @param {Object} res - Response object
  * @param {integer} statusCode - status code to be sent
  * @param {string} errorMessage - the appropraite error message
  * @memberof Utilities
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
  * @param {string} errorMessage - the appropraite error message
  * @memberof Utilities
  */

  static successStatus(res, status, key, object) {
    const response = { status };
    response[key] = object;

    return res.status(status).json(response);
  }

  /**
  * @static
  * @description Creates a query that inserts an object into a table
  * @param {string} table - table to be inserted
  * @param {object} object - objects to insert
  * @param {string} returing - Clause to return a value, Optional
  * @memberof Utilities
  */

  static insertQuery(table, object, returning) {
    let values = Object.values(object);
    values = values.map((value) => {
      if (typeof (value) === 'string') { return `'${value}'`; }
      return value;
    });
    const insert = `INSERT into ${table} (${Object.keys(object)}) VALUES (${values}) ${returning};`;
    return insert;
  }
}

export default Util;
