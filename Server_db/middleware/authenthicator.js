/* eslint-disable prefer-destructuring */
import jwt from 'jsonwebtoken';
import Util from '../helper/Utilities';
import dbMethods from '../migrations/db_methods';

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
      const theuser = await dbMethods.readFromDb('users', '*', { id: verify.id });
      if (!theuser[0]) {
        return Util.errorstatus(res, 400, 'User doesn\'t exist');
      }
      req.body.loggedinUser = theuser[0];
    } catch (err) {
      return Util.errorstatus(res, 401, 'Unauthorized user');
    }
    return next();
  }

  /**
    * @static
    * @description Checks that the user is a client
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @param {Object} next - Next function call
    * @returns {object} Json
    * @memberof Controllers
    */
  static async isClient(req, res, next) {
    const { loggedinUser } = req.body;
    if (loggedinUser.type === 'staff') {
      return Util.errorstatus(res, 403, 'Forbidden, You Are not allowed to perform this action');
    }
    return next();
  }

  /**
    * @static
    * @description Checks that user is a staff
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @param {Object} next - Next function call
    * @returns {object} Json
    * @memberof Controllers
    */
  static async isStaff(req, res, next) {
    const { loggedinUser } = req.body;
    if (loggedinUser.type !== 'staff') {
      return Util.errorstatus(res, 403, 'Forbidden, You Are not allowed to perform this action');
    }
    return next();
  }
}

export default Authenticator;
