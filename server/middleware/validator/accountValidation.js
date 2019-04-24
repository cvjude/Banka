import schema from '../../helper/schema/schema';
import util from '../../helper/utilities';

class AccountValidation {
  /**
  * @static
  * @description Validates account creation details
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */
  static validateAccountCreationDetails(req, res, next) {
    const {
      type, openingBalance,
    } = req.body;

    const validateObject = {
      type, openingBalance,
    };

    const error = util.validateJoi(validateObject, schema.account);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.type = type.trim();
    return next();
  }

  /**
  * @static
  * @description Validates account activation or deactivation details
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */
  static validateAccountStatus(req, res, next) {
    const {
      status,
    } = req.body;

    const accountNumber = Number(req.params.accountNumber);

    const validateObject = {
      status, accountNumber,
    };

    const error = util.validateJoi(validateObject, schema.setAccount);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.accountNumber = accountNumber;
    req.body.status = status.trim();
    return next();
  }
}

export default AccountValidation;
