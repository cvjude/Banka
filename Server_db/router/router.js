/* eslint-disable linebreak-style */
import express from 'express';
import Controller from '../controllers/controller';
import Validate from '../middleware/validator';
import User from '../controllers/usercontroller';
import Authenticator from '../middleware/authenthicator';

// the sub app using url versioning
const router = express();

router.get('/', Controller.welcome);
router.get('/accounts/:accountNumber/transactions', Authenticator.user, Validate.accountNumber, Controller.getAllTransactions);
router.get('/transactions/:id', Authenticator.user, Validate.id, Controller.getTransaction);

router.post('/auth/signup', Validate.Signup, User.signup);
router.post('/auth/signin', Validate.Signin, User.signin);

router.post('/accounts', Authenticator.user, Validate.createAccount, Controller.creatAccount);
router.post('/transactions/:accountNumber/debit', Authenticator.user, Validate.transaction, Controller.transactions);
router.post('/transactions/:accountNumber/credit', Authenticator.user, Validate.transaction, Controller.transactions);

router.patch('/account/:accountNumber', Authenticator.user, Validate.setAccount, Controller.setAccount);

router.delete('/accounts/:accountNumber', Authenticator.user, Validate.accountNumber, Controller.deleteAccount);
export default router;
