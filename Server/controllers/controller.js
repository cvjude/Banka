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
    * @memberof questionerController
    */

  static welcome(req, res) {
    return res.status(200).json({ message: 'welcome to the Banka app' });
  }

  /**
    * @static
    * @description Display a welcome message
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @returns {object} Json
    * @memberof questionerController
    */

  static creatAccount(req, res) {
    const { type, balance, decoded } = req.body;
    const createdon = new Date();
    const status = 'active';
    const owner = decoded.id;
    const useraccount = Users.find(user => user.id === owner);

    if (useraccount === undefined) {
      return Util.errorstatus(res, 400, 'User not found');
    }

    if (useraccount.isadmin) {
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
      balance,
    };

    const {
      firstname, lastname, email,
    } = useraccount;

    const datas = {
      accountnumber,
      firstname,
      lastname,
      email,
      type,
    };

    Accounts.push(accountobj);
    return Util.successStatus(res, 201, datas);
  }
}

export default Controller;
