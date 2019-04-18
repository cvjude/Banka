/* eslint-disable linebreak-style */
import util from '../helper/Utilities';
import queries from '../migrations/queries';
import pool from '../config/config';

class Controller {
  static async transactions(req, res) {
    const { loggedinUser, accountNumber, amount } = req.body;
    try {
      const userAccount = await pool.query(queries.accounts.getAccount, [accountNumber]);

      if (!userAccount.rows[0]) {
        return util.errorstatus(res, 400, 'Account not found');
      }

      const oldBalance = userAccount.rows[0].balance;
      const { status } = userAccount.rows[0];
      let newBalance;
      const type = req.url.endsWith('debit') ? 'debit' : 'credit';
      const cashier = loggedinUser.id;
      if (loggedinUser.isadmin === 'false' && loggedinUser.type === 'staff') {
        if (type === 'debit') {
          if (status === 'dormant') { return util.errorstatus(res, 400, 'cannot perform transaction on dormant account'); }

          if (oldBalance < amount) { return util.errorstatus(res, 400, 'insuffcient fund'); }

          newBalance = oldBalance - amount;
        } else {
          newBalance = oldBalance + amount;
        }
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
    return util.errorstatus(res, 403, 'Forbidden, You Are not allowed to perform this action');
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

  static async getSingleTransactionById(req, res) {
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
}

export default Controller;
