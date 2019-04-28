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
    let { type } = req.body;
    const { openingBalance } = req.body;
    type = type.toLowerCase();

    const validateObject = {
      type, openingBalance,
    };

    const error = util.validateJoi(validateObject, schema.account);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.type = type.trim();
    req.body.type = type;
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
    let {
      status,
    } = req.body;

    status = status.toLowerCase();
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
    req.body.status = status;
    return next();
  }
}

export default AccountValidation;
