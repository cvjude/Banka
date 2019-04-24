import util from '../helper/utilities';
import { hash, checkPassword } from '../helper/passwordHash';
import token from '../helper/token';
import dbMethods from '../migrations/dbMethods';

class UserController {
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
  * @description Allow a user to upload an image
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @returns {object} Json
  * @memberof Controllers
  */
  static async addImage(req, res) {
    const { profilePic, loggedinUser } = req.body;
    const { id } = loggedinUser;

    try {
      await dbMethods.updateDbRow('users', { profilePic }, { id });
    } catch (error) {
      return util.errorstatus(res, 500, 'SERVER ERROR');
    }
    return util.successStatus(res, 200, 'message', 'Image uploaded');
  }

  /**
  * @static
  * @description Get signedin user details
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @returns {object} Json
  * @memberof Controllers
  */
  static async getDetails(req, res) {
    const {
      firstname,
      lastname,
      email,
      profilepic,
    } = req.body.loggedinUser;

    return util.successStatus(res, 200, 'data', {
      firstName: firstname,
      lastName: lastname,
      email,
      profilePic: profilepic,
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
  static async signup(req, res) {
    const {
      email, firstName, lastName, password,
    } = req.body;

    const isAdmin = false;
    const type = 'client';

    let user;
    try {
      user = await dbMethods.readFromDb('users', '*', { email });
    } catch (error) {
      return util.errorstatus(res, 500, 'SERVER ERROR');
    }

    if (user[0]) {
      return util.errorstatus(res, 409, 'User already exist');
    }

    const hashPassword = hash(password);
    const fetchedUser = await dbMethods.insertToDb('users', {
      firstName,
      lastName,
      email,
      hashPassword,
      type,
      isAdmin,
    }, 'RETURNING id');

    const { id } = fetchedUser;
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
    const { email, password } = req.body;
    let user;
    try {
      user = await dbMethods.readFromDb('users', '*', { email });
    } catch (error) {
      return util.errorstatus(res, 500, 'SERVER ERROR');
    }
    if (!user[0]) {
      return util.errorstatus(res, 400, 'User doesn\'t exist');
    }

    if (!checkPassword(password.trim(), user[0].hashpassword)) {
      return util.errorstatus(res, 400, 'Email or password not correct');
    }

    const {
      id, firstname, lastname, type, isadmin,
    } = user[0];

    const tokenObj = { id };

    return util.successStatus(res, 200, 'data', {
      token: token(tokenObj),
      id,
      firstName: firstname,
      lastName: lastname,
      email,
      type,
      isadmin,
    });
  }
}

export default UserController;
