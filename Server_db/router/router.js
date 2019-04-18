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

router.get('/accounts/:accountNumber', Authenticator.user, Validate.accountNumber, AccountController.getAccountDetails);
router.get('/user/:email/accounts', Authenticator.user, Validate.email, AccountController.getAllUserAccounts);
router.post('/accounts', Authenticator.user, Authenticator.isClient, Validate.createAccount, AccountController.createAccount);
router.patch('/account/:accountNumber', Authenticator.user, Authenticator.isStaff, Validate.setAccount, AccountController.updateAccount);
router.delete('/accounts/:accountNumber', Authenticator.user, Authenticator.isStaff, Validate.accountNumber, AccountController.deleteAccount);

router.get('/accounts/:accountNumber/transactions', Authenticator.user, Validate.accountNumber, TransactionController.getSingleAccountTransactions);
router.get('/transactions/:id', Authenticator.user, Validate.id, TransactionController.getSingleTransactionById);
router.post('/transactions/:accountNumber/debit', Authenticator.user, Validate.transaction, TransactionController.transactions);
router.post('/transactions/:accountNumber/credit', Authenticator.user, Validate.transaction, TransactionController.transactions);

export default router;
