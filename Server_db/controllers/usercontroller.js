import util from '../helper/Utilities';
import { hash, checkPassword } from '../helper/passwordhash';
import token from '../helper/token';
import queries from '../migrations/queries';
import pool from '../config/config';

class User {
  /**
  * @static
  * @description Allow a user to signup
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @returns {object} Json
  * @memberof Controllers
  */
  static async signup(req, res) {
    const {
      email, firstName,
      lastName, password,
    } = req.body;

    // const id = userData.length + 1;
    let fetchedUser;
    const isAdmin = false;
    const type = 'client';

    try {
      const user = await pool.query(queries.users.byEmail, [
        email,
      ]);

      if (user.rows[0]) {
        return util.errorstatus(res, 409, 'User already exist');
      }

      const hashPassword = hash(password);

      fetchedUser = await pool.query(queries.users.newUser, [
        firstName,
        lastName,
        email,
        hashPassword,
        type,
        isAdmin,
      ]);
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    const { id } = fetchedUser.rows[0];
    const tokenObj = { id };
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
  static async signin(req, res) {
    const {
      email, password,
    } = req.body;

    let user;
    try {
      user = await pool.query(queries.users.byEmail, [
        email,
      ]);

      if (!user.rows[0]) {
        return util.errorstatus(res, 400, 'User doesn\'t exist');
      }

      if (!checkPassword(password.trim(), user.rows[0].hashpassword)) {
        return util.errorstatus(res, 400, 'Email or password not correct');
      }
    } catch (error) {
      return util.errorstatus(res, 500, 'Server error');
    }

    const {
      id, firstname, lastname,
    } = user.rows[0];

    const tokenObj = { id };

    const datas = {
      token: token(tokenObj),
      id,
      firstName: firstname,
      lastName: lastname,
      email,
    };

    return util.successStatus(res, 200, 'data', datas);
  }
}

export default User;
