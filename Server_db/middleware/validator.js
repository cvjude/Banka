import schema from '../helper/schema/schema';
import util from '../helper/Utilities';

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
      firstName, lastName, email, password,
    } = req.body;

    const validateObject = {
      firstName, lastName, email, password,
    };

    const error = util.validateJoi(validateObject, schema.signup);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    return next();
  }
}

export default Validate;
