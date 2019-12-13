/* eslint-disable linebreak-style */
import express from 'express';
import AccountController from '../controllers/accountController';
import TransactionController from '../controllers/transactionController';
import parameterValidation from '../middleware/validator/parameterValidation';
import userValidation from '../middleware/validator/userValidation';
import accountValidation from '../middleware/validator/accountValidation';
import UserController from '../controllers/userController';
import Authenticator from '../middleware/authenthicator';
import TransactionValidation from '../middleware/validator/transactionValidation';
import AgroColaController from '../controllers/agrocola';

// the sub app using url versioning
const router = express();

router.get('/', UserController.welcome);

router.post(
  '/auth/signup',
  userValidation.validateSignup,
  UserController.signup,
);
router.post(
  '/auth/signin',
  userValidation.validateSignin,
  UserController.signin,
);
router.get('/user', Authenticator.user, UserController.getDetails);
router.post(
  '/user/signup/:isAdmin',
  Authenticator.user,
  Authenticator.isAdmin,
  userValidation.validateSignup,
  parameterValidation.isAdmin,
  UserController.signup,
);

router.get(
  '/accounts',
  Authenticator.user,
  Authenticator.isStaff,
  AccountController.getAllAccounts,
);
router.get(
  '/accounts/:param',
  Authenticator.user,
  parameterValidation.vaidateParam,
  AccountController.getAccountDetails,
);
router.get(
  '/user/:email/accounts',
  Authenticator.user,
  parameterValidation.email,
  AccountController.getAllUserAccounts,
);
router.post(
  '/accounts',
  Authenticator.user,
  Authenticator.isClient,
  accountValidation.validateAccountCreationDetails,
  AccountController.createAccount,
);
router.patch(
  '/account/:accountNumber',
  Authenticator.user,
  Authenticator.isStaff,
  accountValidation.validateAccountStatus,
  AccountController.updateAccount,
);
router.delete(
  '/accounts/:param',
  Authenticator.user,
  Authenticator.isStaff,
  parameterValidation.vaidateParam,
  AccountController.deleteAccount,
);

router.get(
  '/accounts/:param/transactions',
  Authenticator.user,
  parameterValidation.vaidateParam,
  TransactionController.getSingleAccountTransactions,
);
router.get(
  '/transactions/:param',
  Authenticator.user,
  parameterValidation.vaidateParam,
  TransactionController.getSingleTransactionById,
);
router.post(
  '/transactions/:accountNumber/debit',
  Authenticator.user,
  TransactionValidation.ValidateTransaction,
  TransactionController.transactions,
);
router.post(
  '/transactions/:accountNumber/credit',
  Authenticator.user,
  TransactionValidation.ValidateTransaction,
  TransactionController.transactions,
);

router.patch(
  '/image',
  Authenticator.user,
  Authenticator.isClient,
  userValidation.validatePicture,
  UserController.addImage,
);

router.post('/agrocola/create-farmer', AgroColaController.redirect);
router.post('/agrocola/create-input-supplier', AgroColaController.redirect);
router.post('/agrocola/create-logistics', AgroColaController.redirect);
router.post('/agrocola/create-offtaker', AgroColaController.redirect);

export default router;
