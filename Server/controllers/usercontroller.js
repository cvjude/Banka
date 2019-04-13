import userData from '../model/userdata';
import util from '../helper/Utilities';
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
      email, firstName,
      lastName, password,
    } = req.body;

    const id = userData.length + 1;
    const isAdmin = false;
    const type = 'client';

    const user = userData.find(users => users.email === email);
    const hashPassword = hash(password);
    if (user) {
      return util.errorstatus(res, 409, 'User already exist');
    }

    const Userobj = {
      id,
      email,
      firstName,
      lastName,
      hashPassword,
      isAdmin,
      type,
    };

    const tokenObj = { id };

    userData.push(Userobj);

    const datas = {
      token: token(tokenObj),
      id,
      firstName,
      lastName,
      email,
    };

    return util.successStatus(res, 201, 'data', datas);
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

    const user = userData.find(users => users.email === email);
    if (!user) {
      return util.errorstatus(res, 400, 'User doesn\'t exist');
    }

    if (!checkPassword(password.trim(), user.hashPassword)) {
      return util.errorstatus(res, 400, 'password not correct');
    }

    const {
      id, firstName, lastName,
    } = user;

    const tokenObj = { id };

    const datas = {
      token: token(tokenObj),
      id,
      firstName,
      lastName,
      email,
    };

    return util.successStatus(res, 200, 'data', datas);
  }
}

export default User;
