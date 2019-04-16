import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const token = payload => jwt.sign(payload, process.env.TOKEN_KEY, {
  expiresIn: '1d', // expires in 365 days
});

export default token;
