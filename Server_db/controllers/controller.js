/* eslint-disable linebreak-style */

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
}

export default Controller;
