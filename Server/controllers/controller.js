/* eslint-disable linebreak-style */
import Accounts from '../model/accounts';
import Util from '../helper/Utilities';
import Transactions from '../model/transaction';


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
    const { type, openingbalance, thisUser } = req.body;
    const createdon = new Date();
    const status = 'active';
    const owner = thisUser.id;

    if (thisUser.type === 'staff') {
      return Util.errorstatus(res, 403, 'Forbidden');
    }

    const id = Accounts.length + 1;
    const accountnumber = Accounts[id - 2].accountnumber + 1;
    const accountobj = {
      id,
      accountnumber,
      createdon,
      owner,
      type,
      status,
      balance: openingbalance,
    };

    const {
      firstname, lastname, email,
    } = thisUser;

    const datas = {
      accountnumber,
      firstname,
      lastname,
      email,
      type,
      openingbalance,
    };

    Accounts.push(accountobj);
    return Util.successStatus(res, 201, 'data', datas);
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
    const { status, thisUser, accountnumber } = req.body;
    const useraccount = Accounts.find(account => account.accountnumber === accountnumber);
    if (useraccount === undefined) {
      return Util.errorstatus(res, 400, 'Account number not found');
    }

    if (thisUser.type !== 'staff') {
      return Util.errorstatus(res, 403, 'Forbidden');
    }

    const index = Accounts.findIndex(account => account.accountnumber === accountnumber);
    Accounts[index].status = status;

    const datas = {
      accountnumber,
      status,
    };

    return Util.successStatus(res, 200, 'data', datas);
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
    const { thisUser, accountnumber } = req.body;
    const useraccount = Accounts.find(account => account.accountnumber === accountnumber);
    if (useraccount === undefined) {
      return Util.errorstatus(res, 400, 'Account number not found');
    }

    if (thisUser.type !== 'staff') {
      return Util.errorstatus(res, 403, 'Forbidden');
    }

    const index = Accounts.findIndex(account => account.accountnumber === accountnumber);
    Accounts.splice(index, 1);
    return Util.successStatus(res, 200, 'message', 'Account successfully deleted');
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
    const { thisUser, accountnumber, amount } = req.body;
    const useraccount = Accounts.find(account => account.accountnumber === accountnumber);

    if (useraccount === undefined) {
      return Util.errorstatus(res, 400, 'Account number not found');
    }

    const oldbalance = useraccount.balance;
    let newbalance;
    const createdon = new Date();
    const type = req.url.endsWith('debit') ? 'debit' : 'credit';
    const transactionid = Transactions.length + 1;
    const cashier = thisUser.id;
    if (!thisUser.isadmin && thisUser.type === 'staff') {
      const acbalance = (type === 'debit') ? (oldbalance - amount) : (oldbalance + amount);
      newbalance = acbalance;
      const transactionobj = {
        id: transactionid,
        createdon,
        type,
        accountnumber,
        cashier,
        amount,
        oldbalance,
        newbalance,
      };
      const index = Accounts.findIndex(account => account.accountnumber === accountnumber);
      Accounts[index].balance = newbalance;
      Transactions.push(transactionobj);
      const datas = {
        transactionid,
        accountnumber,
        amount,
        cashier,
        transactionType: type,
        accountBalance: newbalance,
      };
      return Util.successStatus(res, 200, 'data', datas);
    }
    return Util.errorstatus(res, 403, 'Forbidden');
  }
}

export default Controller;
