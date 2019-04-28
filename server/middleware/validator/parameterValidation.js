import schema from '../../helper/schema/schema';
import util from '../../helper/utilities';

class ParameterValidation {
  /**
  * @static
  * @description Validates numeric param account account number
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */
  static vaidateParam(req, res, next) {
    const param = Number(req.params.param);

    const error = util.validateJoi({ param }, schema.checkParam);
    if (param.toString().length > 10) {
      return util.errorstatus(res, 400, 'AccountNumber should be 10 digits');
    }
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.param = param;
    return next();
  }

  /**
  * @static
  * @description Validates account account number
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */
  static email(req, res, next) {
    const { email } = req.params;

    const error = util.validateJoi({ email }, schema.email);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.email = email.trim();
    req.body.email = email.toLowerCase();
    return next();
  }

  /**
  * @static
  * @description Validates account account number
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */
  static isAdmin(req, res, next) {
    let { isAdmin } = req.params;
    isAdmin = isAdmin.toLowerCase();
    const error = util.validateJoi({ isAdmin }, schema.isAdmin);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.isadmin = isAdmin;
    return next();
  }
}

export default ParameterValidation;
