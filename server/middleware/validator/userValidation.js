import schema from '../../helper/schema/schema';
import util from '../../helper/utilities';

class UserValidation {
  /**
  * @static
  * @description Validates a signup request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static validateSignup(req, res, next) {
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

    req.body.firstName = firstName.trim();
    req.body.lastName = lastName.trim();
    req.body.password = password.trim();
    req.body.email = email.trim();
    req.body.email = email.toLowerCase();
    return next();
  }

  /**
  * @static
  * @description Validates a signin request
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static validateSignin(req, res, next) {
    const {
      email, password,
    } = req.body;

    const validateObject = {
      email, password,
    };

    const error = util.validateJoi(validateObject, schema.signin);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.password = password.trim();
    req.body.email = email.trim();
    req.body.email = email.toLowerCase();
    return next();
  }

  /**
  * @static
  * @description Validates picture url
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */
  static validatePicture(req, res, next) {
    const { profilePic } = req.body;
    const error = util.validateJoi({ profilePic }, schema.picture);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.profilePic = profilePic.trim();
    return next();
  }
}

export default UserValidation;
