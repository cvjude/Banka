/* eslint-disable prefer-destructuring */
import jwt from 'jsonwebtoken';
import Util from '../helper/Utilities';
import queries from '../migrations/queries';
import pool from '../config/config';

class Authenticator {
  /**
  * @static
  * @description Authenticate the routes
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @param {Object} next - Next function call
  * @returns {object} Json
  * @memberof Controllers
  */
  static async user(req, res, next) {
    const codedToken = req.headers.authorization;
    if (!codedToken) {
      return Util.errorstatus(res, 401, 'Authorization error');
    }
    const token = codedToken.split(' ')[1];
    try {
      const verify = jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => decoded);
      const theuser = await pool.query(queries.users.byId, [
        verify.id,
      ]);
      req.body.thisUser = theuser.rows[0];
    } catch (err) {
      return Util.errorstatus(res, 401, 'Unauthorized user');
    }
    return next();
  }
}

export default Authenticator;
