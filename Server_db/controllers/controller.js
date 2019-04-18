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
      return util.errorstatus(res, 403, 'Forbidden, You Are not allowed to perform this action');
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

  static async updateAccount(req, res) {
    const { status, thisUser, accountNumber } = req.body;

    if (thisUser.type !== 'staff') {
      return util.errorstatus(res, 403, 'Forbidden, You Are not allowed to perform this action');
    }

    try {
      const userAccount = await pool.query(queries.accounts.getAccount, [accountNumber]);

      if (!userAccount.rows[0]) {
        return util.errorstatus(res, 400, 'Account not found');
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
      return util.errorstatus(res, 403, 'Forbidden, You Are not allowed to perform this action');
    }

    try {
      const userAccount = await pool.query(queries.accounts.getAccount, [accountNumber]);

      if (!userAccount.rows[0]) {
        return util.errorstatus(res, 400, 'Account not found');
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
        return util.errorstatus(res, 400, 'Account not found');
      }

      const oldBalance = userAccount.rows[0].balance;
      let newBalance;
      const type = req.url.endsWith('debit') ? 'debit' : 'credit';
      const cashier = thisUser.id;
      if (thisUser.isadmin === 'false' && thisUser.type === 'staff') {
        const acbalance = (type === 'debit') ? (oldBalance - amount) : (oldBalance + amount);
        newBalance = acbalance;
        const transactions = await pool.query(queries.transactions.newTransaction, [
          type,
          cashier,
          amount,
          oldBalance,
          newBalance,
          accountNumber,
        ]);

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
    return util.errorstatus(res, 403, 'Forbidden, You Are not allowed to erform this action');
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
        return util.errorstatus(res, 400, 'Account not found');
      }

      transactions = await pool.query(queries.transactions.getAllTransactions, [accountNumber]);
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    const datas = transactions.rows.map((transaction) => {
      const {
        id, createdon, type, amount, oldbalance, newbalance, accountnumber,
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

  /**
    * @static
    * @description Allows users to get a transaction by id
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static async getTransaction(req, res) {
    const { id } = req.body;
    let transaction;

    try {
      transaction = await pool.query(queries.transactions.getbyId, [id]);

      if (!transaction.rows[0]) {
        return util.errorstatus(res, 400, 'Transaction not found');
      }
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    const {
      createdon, type, amount, oldbalance, newbalance, accountnumber,
    } = transaction.rows[0];

    const datas = {
      transactionId: id,
      createdOn: createdon,
      type,
      accountNumber: accountnumber,
      amount,
      oldBalance: oldbalance,
      newBalance: newbalance,
    };
    return util.successStatus(res, 200, 'data', datas);
  }

  /**
    * @static
    * @description Allows users to get all accounts for a user
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static async getAllUserAccounts(req, res) {
    const { email } = req.body;

    const owner = await pool.query(queries.users.byEmail, [email]);

    if (!owner.rows[0]) {
      return util.errorstatus(res, 400, 'User not found');
    }
    let accounts;

    try {
      accounts = await pool.query(queries.accounts.getUSerAccounts, [owner.rows[0].id]);

      if (!accounts.rows[0]) {
        return util.errorstatus(res, 400, 'User has no account');
      }
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    const datas = accounts.rows.map((account) => {
      const {
        createdon, accountnumber, type, status, balance,
      } = account;
      return {
        createdOn: createdon,
        accountNumber: accountnumber,
        type,
        status,
        balance,
      };
    });
    return util.successStatus(res, 200, 'data', datas);
  }

  /**
    * @static
    * @description Allows users to get an account Detail
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static async getAccountDetails(req, res) {
    const { accountNumber } = req.body;
    let Accountdetails;

    try {
      Accountdetails = await pool.query(queries.join.AccountOnEmail, [accountNumber]);

      if (!Accountdetails.rows[0]) {
        return util.errorstatus(res, 400, 'Account number not found');
      }
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    const {
      createdon, email, accountnumber, type, status, balance,
    } = Accountdetails.rows[0];

    const datas = {
      createdOn: createdon,
      accountNumber: accountnumber,
      ownerEmail: email,
      type,
      status,
      balance,
    };
    return util.successStatus(res, 200, 'data', datas);
  }
}

export default Controller;
