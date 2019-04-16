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

    const accounts = await pool.query(queries.accounts.getAll);

    const id = accounts.rows.length + 1;
    const accountNumber = accounts.rows[id - 2].accountnumber + 1;

    try {
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
}

export default Controller;
