/* eslint-disable linebreak-style */
import util from '../helper/Utilities';
import queries from '../migrations/queries';
import pool from '../config/config';

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

  static async creatAccount(req, res) {
    const { type, openingBalance, thisUser } = req.body;
    const status = 'active';
    const owner = thisUser.id;

    if (thisUser.type === 'staff') {
      return util.errorstatus(res, 403, 'Forbidden');
    }

    let accountNumber;

    try {
      const accounts = await pool.query(queries.accounts.getAll);

      const id = accounts.rows.length + 1;
      accountNumber = accounts.rows[id - 2].accountnumber + 1;

      await pool.query(queries.accounts.newAccount, [
        accountNumber,
        owner,
        type,
        status,
        openingBalance,
      ]);
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    const {
      firstname, lastname, email,
    } = thisUser;

    const datas = {
      accountNumber,
      firstName: firstname,
      lastName: lastname,
      email,
      type,
      openingBalance,
    };

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

  static async setAccount(req, res) {
    const { status, thisUser, accountNumber } = req.body;

    if (thisUser.type !== 'staff') {
      return util.errorstatus(res, 403, 'Forbidden');
    }

    try {
      const userAccount = await pool.query(queries.accounts.getAccount, [accountNumber]);

      if (!userAccount.rows[0]) {
        return util.errorstatus(res, 400, 'Account number not found');
      }

      await pool.query(queries.accounts.updateStatus, [status, accountNumber]);
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }
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

  static async deleteAccount(req, res) {
    const { thisUser, accountNumber } = req.body;

    if (thisUser.type !== 'staff') {
      return util.errorstatus(res, 403, 'Forbidden');
    }

    try {
      const userAccount = await pool.query(queries.accounts.getAccount, [accountNumber]);

      if (!userAccount.rows[0]) {
        return util.errorstatus(res, 400, 'Account number not found');
      }
      await pool.query(queries.accounts.delete, [accountNumber]);
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    return util.successStatus(res, 200, 'message', 'Account successfully deleted');
  }

  /**
    * @static
    * @description Allows Staff to debit and also to credit an account,
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static async transactions(req, res) {
    const { thisUser, accountNumber, amount } = req.body;
    try {
      const userAccount = await pool.query(queries.accounts.getAccount, [accountNumber]);

      if (!userAccount.rows[0]) {
        return util.errorstatus(res, 400, 'Account number not found');
      }

      const oldBalance = userAccount.rows[0].balance;
      let newBalance;
      const type = req.url.endsWith('debit') ? 'debit' : 'credit';
      const cashier = thisUser.id;
      if (thisUser.isadmin === 'false' && thisUser.type === 'staff') {
        const acbalance = (type === 'debit') ? (oldBalance - amount) : (oldBalance + amount);
        newBalance = acbalance;
        await pool.query(queries.transactions.newTransaction, [
          type,
          cashier,
          amount,
          oldBalance,
          newBalance,
          accountNumber,
        ]);

        const transactions = await pool.query(queries.transactions.getTransaction, [accountNumber]);
        await pool.query(queries.accounts.updateBalance, [newBalance, accountNumber]);

        const datas = {
          transactionId: transactions.id,
          accountNumber,
          amount,
          cashier,
          transactionType: type,
          accountBalance: newBalance,
        };
        return util.successStatus(res, 200, 'data', datas);
      }
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }
    return util.errorstatus(res, 403, 'Forbidden');
  }

  /**
    * @static
    * @description Allows users to get account transactions for an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static async getAllTransactions(req, res) {
    const { accountNumber } = req.body;
    let transactions;

    try {
      const userAccount = await pool.query(queries.accounts.getAccount, [accountNumber]);

      if (!userAccount.rows[0]) {
        return util.errorstatus(res, 400, 'Account number not found');
      }

      transactions = await pool.query(queries.transactions.getAllTransactions, [accountNumber]);
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    const datas = transactions.rows.map((transaction) => {
      const {
        id, createdOn: createdon, type, amount, oldbalance, newbalance, accountnumber,
      } = transaction;
      return {
        transactionId: id,
        createdOn: createdon,
        type,
        accountNumber: accountnumber,
        amount,
        oldBalance: oldbalance,
        newBalance: newbalance,
      };
    });
    return util.successStatus(res, 200, 'data', datas);
  }
}

export default Controller;
