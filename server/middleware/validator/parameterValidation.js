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
    return next();
  }
}

export default ParameterValidation;