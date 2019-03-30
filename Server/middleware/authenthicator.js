import jwt from 'jsonwebtoken';

class Authenticator {
  /**
    * @static
    * @description Authenticate an admin
    * @param {object} req - Request object
    * @param {object} res - Response object
    * @param {Object} next - Next function call
    * @returns {object} Json
    * @memberof Controllers
    */
  static user(req, res, next) {
    const codedToken = req.headers.authorization;
    if (codedToken === undefined) {
      return res.status(401).json({
        status: 401,
        error: 'Authorization error',
      });
    }
    const token = codedToken.split(' ')[1];
    const verify = jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized user',
        });
      }
      return decoded;
    });
    req.body.decoded = verify;
    return next();
  }
}

export default Authenticator;
