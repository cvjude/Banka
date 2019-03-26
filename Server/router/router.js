/* eslint-disable linebreak-style */
import express from 'express';
import controller from '../controllers/controller';
import Validate from '../middleware/validator';
import User from '../controllers/usercontroller';

// the sub app using url versioning
const router = express();

router.get('/', controller.welcome);

router.post('/auth/signup', Validate.Signup, User.signup);

export default router;
