/* eslint-disable linebreak-style */
import express from 'express';
import Controller from '../controllers/controller';
import Validate from '../middleware/validator';
import User from '../controllers/usercontroller';
import Authenticator from '../middleware/authenthicator';

// the sub app using url versioning
const router = express();

router.get('/', Controller.welcome);

router.post('/auth/signup', Validate.Signup, User.signup);
router.post('/auth/signin', Validate.Signin, User.signin);

router.post('/accounts', Authenticator.user, Validate.createAccount, Controller.creatAccount);

router.patch('/account/:accountnumber', Authenticator.user, Validate.setAccount, Controller.setAccount);
export default router;
