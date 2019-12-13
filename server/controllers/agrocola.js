/* eslint-disable linebreak-style */
import axios from 'axios';
import util from '../helper/utilities';

class AgroColaController {
  /**
   * @static
   * @description Sets account status to either active or dormant
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} Json
   * @memberof Controller
   */

  static async redirect(req, res) {
    const path = req.route.path.split('/')[2];

    let response;
    try {
      response = axios.post(`http://api.agrocola.com:8080/api/v1/${path}`);
    } catch (err) {
      return util.errorstatus(res, 400, 'req', err);
    }

    return util.successStatus(res, 201, 'req', response.data);
  }
}

export default AgroColaController;
