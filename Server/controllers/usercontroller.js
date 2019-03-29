import Userdata from '../model/userdata';
import Util from '../helper/Utilities';
import { hash, checkPassword } from '../helper/passwordhash';
import token from '../helper/token';

class User {
  /**
  * @static
  * @description Allow a user to signup
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @returns {object} Json
  * @memberof Controllers
  */
  static signup(req, res) {
    const {
      email, firstname,
      lastname, password,
    } = req.body;

    const id = Userdata.length + 1;
    const isAdmin = false;
    const type = 'client';

    const user = Userdata.find(users => users.email === email);
    const hashpassword = hash(password);
    if (user) {
      return Util.errorstatus(res, 409, 'User already exist');
    }

    const Userobj = {
      id,
      email,
      firstname,
      lastname,
      hashpassword,
      isAdmin,
      type,
    };

    const tokenObj = { id };

    Userdata.push(Userobj);
    return res.status(200).json({
      status: 200,
      data: {
        token: token(tokenObj),
        id,
        firstname,
        lastname,
        email,
      },
    });
  }

  /**
  * @static
  * @description Allow a user to signup
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @returns {object} Json
  * @memberof Controllers
  */
  static signin(req, res) {
    const {
      email, password,
    } = req.body;

    const user = Userdata.find(users => users.email === email);
    if (!user) {
      return Util.errorstatus(res, 400, 'User doesn\'t exist');
    }

    if (!checkPassword(password.trim(), user.hashpassword)) {
      return Util.errorstatus(res, 400, 'password not correct');
    }

    const {
      id, firstname, lastname,
    } = user;

    const tokenObj = { id };
    return res.status(200).json({
      status: 200,
      data: {
        token: token(tokenObj),
        id,
        firstname,
        lastname,
        email,
      },
    });
  }
}

export default User;
