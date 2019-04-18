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

    req.body.firstName = firstName.trim();
    req.body.lastName = lastName.trim();
    req.body.password = password.trim();

    const error = util.validateJoi(validateObject, schema.signup);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
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

    req.body.type = type.trim();

    const error = util.validateJoi(validateObject, schema.account);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
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

    req.body.status = status.trim();

    const accountNumber = Number(req.params.accountNumber);

    const validateObject = {
      status, accountNumber,
    };

    const error = util.validateJoi(validateObject, schema.setAccount);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.accountNumber = accountNumber;
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
  static accountNumber(req, res, next) {
    const accountNumber = Number(req.params.accountNumber);

    const error = util.validateJoi({ accountNumber }, schema.checkAccount);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.accountNumber = accountNumber;
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
  static id(req, res, next) {
    const id = Number(req.params.id);

    const error = util.validateJoi({ id }, schema.id);
    if (error) {
      return util.errorstatus(res, 400, error);
    }
    req.body.id = id;
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
    return next();
  }
}

export default Validate;
