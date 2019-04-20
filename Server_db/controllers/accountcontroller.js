/* eslint-disable linebreak-style */
import util from '../helper/Utilities';
import queries from '../migrations/queries';
import pool from '../config/config';
import dbMethods from '../migrations/db_methods';

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
      const { accountnumber } = await dbMethods.getLastDbMember('accounts', 'accountnumber', 'accountnumber');
      accountNumber = accountnumber + 1;
      await dbMethods.insertToDb('accounts', {
        accountNumber, owner, type, status, balance: openingBalance,
      });
    } catch (error) {
      return util.errorstatus(res, 500, 'SERVER ERROR');
    }

    const { firstname, lastname, email } = loggedinUser;

    const datas = {
      accountNumber, firstName: firstname, lastName: lastname, email, type, openingBalance,
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
      const userAccount = await dbMethods.readFromDb('accounts', '*', { accountNumber });
      if (!userAccount[0]) {
        return util.errorstatus(res, 400, 'Account not found');
      }

      await dbMethods.updateDbRow('accounts', { status }, { accountNumber });
    } catch (error) {
      return util.errorstatus(res, 500, 'SERVER ERROR');
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
    const { param } = req.body; const accountNumber = param;
    try {
      const userAccount = await dbMethods.readFromDb('accounts', '*', { accountNumber });

      if (!userAccount[0]) {
        return util.errorstatus(res, 400, 'Account not found');
      }

      await dbMethods.deleteDbRow('accounts', { accountNumber });
    } catch (error) {
      return util.errorstatus(res, 500, 'SERVER ERROR');
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
    let accounts;
    try {
      const owner = await dbMethods.readFromDb('users', '*', { email });

      if (!owner[0]) { return util.errorstatus(res, 400, 'User not found'); }

      accounts = await dbMethods.readFromDb('accounts', '*', { owner: owner[0].id });
    } catch (error) { return util.errorstatus(res, 500, 'SERVER ERROR'); }

    if (!accounts[0]) { return util.errorstatus(res, 400, 'User has no account'); }

    const datas = accounts.map((account) => {
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
    const { param } = req.body;
    let Accountdetails; const accountNumber = param;

    try {
      Accountdetails = await pool.query(queries.join.accountOnEmail, [accountNumber]);

      if (!Accountdetails.rows[0]) {
        return util.errorstatus(res, 400, 'Account not found');
      }
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    const {
      createdon, email, accountnumber, type, status, balance,
    } = Accountdetails.rows[0];

    return util.successStatus(res, 200, 'data', {
      createdOn: createdon,
      accountNumber: accountnumber,
      ownerEmail: email,
      type,
      status,
      balance,
    });
  }

  /**
    * @static
    * @description Allows users to get all account number
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof Controller
    */

  static async getAllAccounts(req, res) {
    let accounts;

    try {
      const { status } = req.query;
      if (status === 'active') { accounts = await pool.query(queries.join.getAllActive); } else if (status === 'dormant') { accounts = await pool.query(queries.join.getAllDormant); } else accounts = await pool.query(queries.join.accountsAndEmail);
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    const datas = accounts.rows.map((account) => {
      const {
        createdon, accountnumber, type, status, balance, email,
      } = account;
      return {
        createdOn: createdon,
        accountNumber: accountnumber,
        ownerEmail: email,
        type,
        status,
        balance,
      };
    });
    return util.successStatus(res, 200, 'data', datas);
  }
}

export default Controller;
