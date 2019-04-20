/* eslint-disable linebreak-style */
import express from 'express';
import AccountController from '../controllers/accountcontroller';
import TransactionController from '../controllers/transactioncontroller';
import Validate from '../middleware/validator';
import UserController from '../controllers/usercontroller';
import Authenticator from '../middleware/authenthicator';

// the sub app using url versioning
const router = express();

router.get('/', UserController.welcome);

router.post('/auth/signup', Validate.Signup, UserController.signup);
router.post('/auth/signin', Validate.Signin, UserController.signin);

router.get('/accounts', Authenticator.user, Authenticator.isStaff, AccountController.getAllAccounts);
router.get('/accounts/:param', Authenticator.user, Validate.param, AccountController.getAccountDetails);
router.get('/user/:email/accounts', Authenticator.user, Validate.email, AccountController.getAllUserAccounts);
router.post('/accounts', Authenticator.user, Authenticator.isClient, Validate.createAccount, AccountController.createAccount);
router.patch('/account/:accountNumber', Authenticator.user, Authenticator.isStaff, Validate.setAccount, AccountController.updateAccount);
router.delete('/accounts/:param', Authenticator.user, Authenticator.isStaff, Validate.param, AccountController.deleteAccount);

router.get('/accounts/:param/transactions', Authenticator.user, Validate.param, TransactionController.getSingleAccountTransactions);
router.get('/transactions/:param', Authenticator.user, Validate.param, TransactionController.getSingleTransactionById);
router.post('/transactions/:accountNumber/debit', Authenticator.user, Validate.transaction, TransactionController.transactions);
router.post('/transactions/:accountNumber/credit', Authenticator.user, Validate.transaction, TransactionController.transactions);

export default router;
