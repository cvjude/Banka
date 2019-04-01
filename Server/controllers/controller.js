/* eslint-disable linebreak-style */
import Accounts from '../model/accounts';
import Users from '../model/userdata';
import Util from '../helper/Utilities';


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

    if (thisUser.isadmin) {
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
      openingbalance,
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

    if (!thisUser.isadmin) {
      return Util.errorstatus(res, 403, 'Forbidden');
    }

    const { owner } = useraccount;

    Users[owner - 1].type = status;
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

    if (!thisUser.isadmin) {
      return Util.errorstatus(res, 403, 'Forbidden');
    }

    const index = Accounts.findIndex(account => account.accountnumber === accountnumber);
    Accounts.splice(index, 1);
    return Util.successStatus(res, 200, 'message', 'Account successfully deleted');
  }
}

export default Controller;
