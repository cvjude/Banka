/* eslint-disable linebreak-style */
import util from '../helper/Utilities';
import queries from '../migrations/queries';
import pool from '../config/config';

class Controller {
  /**
    * @static
    * @description Creates an account
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static async createAccount(req, res) {
    const { type, openingBalance, loggedinUser } = req.body;
    const status = 'active';
    const owner = loggedinUser.id;

    let accountNumber;

    try {
      const previousAccountNumber = await pool.query(queries.accounts.lastAccountNumber);
      const { accountnumber } = previousAccountNumber.rows[0];
      accountNumber = accountnumber + 1;
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
    } = loggedinUser;

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
    const { status, accountNumber } = req.body;

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
    const { accountNumber } = req.body;

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
        return util.errorstatus(res, 400, 'Account not found');
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
