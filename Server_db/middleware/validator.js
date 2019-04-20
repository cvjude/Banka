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

    req.body.firstName = firstName.trim();
    req.body.lastName = lastName.trim();
    req.body.password = password.trim();
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

  static Signin(req, res, next) {
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
    return next();
  }

  /**
  * @static
  * @description Validates account creation details
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */

  static createAccount(req, res, next) {
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
  static setAccount(req, res, next) {
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

  /**
  * @static
  * @description Validates numeric param account account number
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */
  static param(req, res, next) {
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
    req.body.email = email;
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
  static transaction(req, res, next) {
    const accountNumber = Number(req.params.accountNumber);
    const { amount } = req.body;
    const validateObject = {
      amount, accountNumber,
    };
    const error = util.validateJoi(validateObject, schema.transaction);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.accountNumber = accountNumber;
    req.body.amount = Number(amount.toFixed(2));
    return next();
  }
}

export default Validate;
