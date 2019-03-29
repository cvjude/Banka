import schema from '../helper/schema/schema';
import Util from '../helper/Utilities';

class Validate {
  /**
  * @static
  * @description Validates a signup request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static Signup(req, res, next) {
    const {
      firstname, lastname, email, password,
    } = req.body;

    const validateObject = {
      firstname, lastname, email, password,
    };

    const error = Util.validateJoi(validateObject, schema.signup);
    if (error) {
      return Util.errorstatus(res, 400, error);
    }
    return next();
  }

  /**
  * @static
  * @description Validates a signup request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static Signin(req, res, next) {
    const {
      email, password,
    } = req.body;

    const validateObject = {
      email, password,
    };

    const error = Util.validateJoi(validateObject, schema.signin);
    if (error) {
      return Util.errorstatus(res, 400, error);
    }
    return next();
  }
}

export default Validate;
