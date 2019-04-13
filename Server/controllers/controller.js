/* eslint-disable linebreak-style */
import accounts from '../model/accounts';
import util from '../helper/Utilities';
import transactions from '../model/transaction';


class Controller {
  /**
    * @static
    * @description Display a welcome message
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static welcome(req, res) {
    return res.status(200).json({ message: 'welcome to the Banka app' });
  }

  /**
    * @static
    * @description Creates an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static creatAccount(req, res) {
    const { type, openingBalance, thisUser } = req.body;
    const createdOn = new Date();
    const status = 'active';
    const owner = thisUser.id;

    if (thisUser.type === 'staff') {
      return util.errorstatus(res, 403, 'Forbidden');
    }

    const id = accounts.length + 1;
    const accountNumber = accounts[id - 2].accountNumber + 1;
    const accountObj = {
      id,
      accountNumber,
      createdOn,
      owner,
      type,
      status,
      balance: openingBalance,
    };

    const {
      firstName, lastName, email,
    } = thisUser;

    const datas = {
      accountNumber,
      firstName,
      lastName,
      email,
      type,
      openingBalance,
    };

    accounts.push(accountObj);
    return util.successStatus(res, 201, 'data', datas);
  }

  /**
    * @static
    * @description Sets account status to either active or dormant
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static setAccount(req, res) {
    const { status, thisUser, accountNumber } = req.body;
    const userAccount = accounts.find(account => account.accountNumber === accountNumber);
    if (userAccount === undefined) {
      return util.errorstatus(res, 400, 'Account number not found');
    }

    if (thisUser.type !== 'staff') {
      return util.errorstatus(res, 403, 'Forbidden');
    }

    const index = accounts.findIndex(account => account.accountNumber === accountNumber);
    accounts[index].status = status;

    const datas = {
      accountNumber,
      status,
    };

    return util.successStatus(res, 200, 'data', datas);
  }

  /**
    * @static
    * @description Allows Admin/Staff to delete an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static deleteAccount(req, res) {
    const { thisUser, accountNumber } = req.body;
    const userAccount = accounts.find(account => account.accountNumber === accountNumber);
    if (userAccount === undefined) {
      return util.errorstatus(res, 400, 'Account number not found');
    }

    if (thisUser.type !== 'staff') {
      return util.errorstatus(res, 403, 'Forbidden');
    }

    const index = accounts.findIndex(account => account.accountNumber === accountNumber);
    accounts.splice(index, 1);
    return util.successStatus(res, 200, 'message', 'Account successfully deleted');
  }

  /**
    * @static
    * @description Allows Staff to debit an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static transactions(req, res) {
    const { thisUser, accountNumber, amount } = req.body;
    const userAccount = accounts.find(account => account.accountNumber === accountNumber);

    if (userAccount === undefined) {
      return util.errorstatus(res, 400, 'Account number not found');
    }

    const oldBalance = userAccount.balance;
    let newBalance;
    const createdOn = new Date();
    const type = req.url.endsWith('debit') ? 'debit' : 'credit';
    const transactionId = transactions.length + 1;
    const cashier = thisUser.id;
    if (!thisUser.isAdmin && thisUser.type === 'staff') {
      const acbalance = (type === 'debit') ? (oldBalance - amount) : (oldBalance + amount);
      newBalance = acbalance;
      const transactionObj = {
        id: transactionId,
        createdOn,
        type,
        accountNumber,
        cashier,
        amount,
        oldBalance,
        newBalance,
      };
      const index = accounts.findIndex(account => account.accountNumber === accountNumber);
      accounts[index].balance = newBalance;
      transactions.push(transactionObj);
      const datas = {
        transactionId,
        accountNumber,
        amount,
        cashier,
        transactionType: type,
        accountBalance: newBalance,
      };
      return util.successStatus(res, 200, 'data', datas);
    }
    return util.errorstatus(res, 403, 'Forbidden');
  }
}

export default Controller;
