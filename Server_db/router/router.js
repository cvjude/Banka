/* eslint-disable linebreak-style */
import express from 'express';
import Controller from '../controllers/controller';
import Validate from '../middleware/validator';
import User from '../controllers/usercontroller';

// the sub app using url versioning
const router = express();

router.get('/', Controller.welcome);

router.post('/auth/signup', Validate.Signup, User.signup);
router.post('/auth/signin', Validate.Signin, User.signin);

export default router;
