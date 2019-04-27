import schema from '../../helper/schema/schema';
import util from '../../helper/utilities';

class TransactionValidation {
  /**
  * @static
  * @description Validates account account number and the amount
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {Object} next - Next function call
  * @memberof Controllers
  */
  static ValidateTransaction(req, res, next) {
    const accountNumber = Number(req.params.accountNumber);
    const { amount, description } = req.body;
    const validateObject = {
      amount, accountNumber, description,
    };
    const error = util.validateJoi(validateObject, schema.transaction);
    if (error) {
      return util.errorstatus(res, 400, error);
    }

    if (!description) {
      req.body.description = 'transaction';
    }
    req.body.accountNumber = accountNumber;
    req.body.amount = Number(amount.toFixed(2));
    return next();
  }
}

export default TransactionValidation;
