/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import util from '../helper/utilities';
import dbMethods from '../migrations/dbMethods';
import queries from '../migrations/queries';
import pool from '../config/config';

const calulateBalance = (type, balance, amount) => {
  if (type === 'debit') {
    return balance - Math.abs(amount);
  }
  return balance + Math.abs(amount);
};

class TransactionController {
  static async transactions(req, res) {
    const {
      loggedinUser, accountNumber, amount, description,
    } = req.body;
    try {
      const userAccount = await dbMethods.readFromDb('accounts', '*', { accountNumber });

      if (!userAccount[0]) {
        return util.errorstatus(res, 404, 'Account not found');
      }

      const { status, balance } = userAccount[0];
      const type = req.url.endsWith('debit') ? 'debit' : 'credit';

      if (loggedinUser.isadmin === 'true' || loggedinUser.type === 'client') {
        return util.errorstatus(res, 403, 'Forbidden, You Are not allowed to perform this action');
      }

      if (type === 'debit') {
        if (status === 'dormant') {
          return util.errorstatus(res, 400, 'cannot perform transaction on dormant account');
        }
        if (balance < amount) {
          return util.errorstatus(res, 400, 'insuffcient fund');
        }
      }

      const newBalance = calulateBalance(type, balance, amount);
      const transactions = await dbMethods.insertToDb('transactions', {
        type, cashier: loggedinUser.id, amount, oldBalance: balance, newBalance, accountNumber, description,
      }, 'RETURNING *');

      await dbMethods.updateDbRow('accounts', { balance: newBalance }, { accountNumber });

      return util.successStatus(res, 200, 'data', {
        transactionId: transactions.id,
        accountNumber,
        amount,
        cashier: loggedinUser.id,
        transactionType: type,
        accountBalance: newBalance.toFixed(2),
        description,
      });
    } catch (error) { return util.errorstatus(res, 500, 'Server error'); }
  }

  /**
    * @static
    * @description Allows users to get account transactions for an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static async getSingleAccountTransactions(req, res) {
    const { param, loggedinUser } = req.body; const accountNumber = param; let transactions;

    try {
      const { id } = loggedinUser;
      if (loggedinUser.type === 'client') {
        const checkForOnwer = await pool.query(queries.conditional.accountAndId,
          [accountNumber, id]);
        if (!checkForOnwer.rows[0]) {
          return util.errorstatus(res, 400, `Account ${accountNumber} does not belong to this User`);
        }
      }

      const userAccount = await dbMethods.readFromDb('accounts', '*', { accountNumber });

      if (!userAccount[0]) {
        return util.errorstatus(res, 404, 'Account not found');
      }

      transactions = await dbMethods.readFromDb('transactions', '*', { accountNumber });
      if (!transactions[0]) {
        return util.errorstatus(res, 404, 'No transactions for this account');
      }
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    const datas = transactions.map((transaction) => {
      const {
        id, createdon, type, amount, oldbalance, newbalance, accountnumber, description,
      } = transaction;
      return {
        transactionId: id,
        createdOn: createdon,
        type,
        accountNumber: accountnumber,
        amount,
        oldBalance: oldbalance,
        newBalance: newbalance,
        description,
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

  static async getSingleTransactionById(req, res) {
    const { param, loggedinUser } = req.body; const id = param;
    let transaction;

    try {
      if (loggedinUser.type === 'client') {
        const checkForOnwer = await pool.query(queries.join.getTransactionById,
          [loggedinUser.id, id]);
        if (!checkForOnwer.rows[0]) {
          return util.errorstatus(res, 400, 'Account Transaction does not belong to this User');
        }
      }

      transaction = await dbMethods.readFromDb('transactions', '*', { id });
      if (!transaction[0]) {
        return util.errorstatus(res, 404, 'Transaction not found');
      }
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    const {
      createdon, type, amount, oldbalance, newbalance, accountnumber, description,
    } = transaction[0];

    return util.successStatus(res, 200, 'data', {
      transactionId: id,
      createdOn: createdon,
      type,
      accountNumber: accountnumber,
      amount,
      oldBalance: oldbalance,
      newBalance: newbalance,
      description,
    });
  }
}

export default TransactionController;
