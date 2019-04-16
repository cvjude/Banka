import userData from '../model/userdata';
import util from '../helper/Utilities';
import hash from '../helper/passwordhash';
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

    const id = userData.length + 1;
    const isAdmin = false;
    const type = 'client';

    try {
      const user = await pool.query(queries.users.byEmail, [
        email,
      ]);

      const hashPassword = hash(password);
      if (user.rows[0]) {
        return util.errorstatus(res, 409, 'User already exist');
      }

      await pool.query(queries.users.newUser, [
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
}

export default User;
