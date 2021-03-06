import chai from 'chai';
import chaiHttp from 'chai-http';
import request from 'supertest';
import app from '../app';
import users from './testdata/user';
import accounts from './testdata/accounts';

let userToken;
let adminToken;
let staffToken;
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTU1NTc3MDA1M30.6J7Lmugkww_bSoqKArodoQM4su96QtUrhxA500OxEpg';

const { expect } = chai;
chai.use(chaiHttp);

const baseUrl = '/api/v2';

describe('Banka App', () => {
  describe('/display welcome message', () => {
    it('display welcome message on start', (done) => {
      chai.request(app)
        .get(`${baseUrl}/`)
        .end((err, res) => {
          expect(res.body.message).to.equal('welcome to the Banka app');
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('throw an error for an invalid url', (done) => {
      chai.request(app)
        .get(`${baseUrl}/jdfsdfaoioh`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });

    it('Should return an error for an invalid json onject', (done) => {
      request(app)
        .post(`${baseUrl}/accounts`)
        .send('{"invalid"}')
        .type('json')
        .end((err, res) => {
          expect(res.body.error).to.equal('Invalid Json Object');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should throw an error if the logged in user is not in the database', (done) => {
      chai.request(app)
        .post(`${baseUrl}/accounts`)
        .set('authorization', `Bearer ${invalidToken}`)
        .send(accounts[0])
        .end((err, res) => {
          expect(res.body.error).to.equal('User doesn\'t exist');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('POST/auth signup', () => {
    it('should signup a non existing user(client)', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signup`)
        .send(users[4])
        .end((err, res) => {
          expect(res.body).to.not.equal(null);
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should not sign up an existing user', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signup`)
        .send(users[1])
        .end((err, res) => {
          expect(res.body.error).to.equal('User already exist');
          expect(res.statusCode).to.equal(409);
          done();
        });
    });

    it('should return an error for an invalid field', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signup`)
        .send(users[2])
        .end((err, res) => {
          expect(res.body.error[0]).to.equal('lastName should be a string with at least 3 characters');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should return an error for a numeric input in a string field', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signup`)
        .send(users[3])
        .end((err, res) => {
          expect(res.body.error[0]).to.equal('firstName should be a string with at least 3 characters');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('POST/auth signin', () => {
    it('should signin an existing user(Admin)', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signin`)
        .send(users[6])
        .end((err, res) => {
          adminToken = res.body.data.token;
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should signin an existing user(Staff)', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signin`)
        .send(users[7])
        .end((err, res) => {
          staffToken = res.body.data.token;
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should signin an existing user(Client)', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signin`)
        .send(users[1])
        .end((err, res) => {
          userToken = res.body.data.token;
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should not signin on invalid email', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signin`)
        .send(users[3])
        .end((err, res) => {
          expect(res.body.error).to.equal('User doesn\'t exist');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not signin on invalid user input', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signin`)
        .send(users[2])
        .end((err, res) => {
          expect(res.body.error[0]).to.equal('email must be a valid email');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not signin on invalid password', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signin`)
        .send(users[5])
        .end((err, res) => {
          expect(res.body.error).to.equal('Email or password not correct');
          expect(res.statusCode).to.equal(401);
          done();
        });
    });
  });

  describe('POST/ sign up a new Admin/Staff', () => {
    it('should signup a new staff', (done) => {
      chai.request(app)
        .post(`${baseUrl}/user/signup/false`)
        .set('authorization', `Bearer ${adminToken}`)
        .send(users[8])
        .end((err, res) => {
          expect(res.body).to.not.equal(null);
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should signup a new Admin', (done) => {
      chai.request(app)
        .post(`${baseUrl}/user/signup/true`)
        .set('authorization', `Bearer ${adminToken}`)
        .send(users[9])
        .end((err, res) => {
          expect(res.body).to.not.equal(null);
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('Staff should not sign up Admin/Staff', (done) => {
      chai.request(app)
        .post(`${baseUrl}/user/signup/false`)
        .set('authorization', `Bearer ${staffToken}`)
        .send(users[8])
        .end((err, res) => {
          expect(res.body).to.not.equal(null);
          expect(res.statusCode).to.equal(403);
          done();
        });
    });

    it('User should not sign up Admin/Staff', (done) => {
      chai.request(app)
        .post(`${baseUrl}/user/signup/false`)
        .set('authorization', `Bearer ${userToken}`)
        .send(users[8])
        .end((err, res) => {
          expect(res.body).to.not.equal(null);
          expect(res.statusCode).to.equal(403);
          done();
        });
    });

    it('should return an error for an invalid parameter', (done) => {
      chai.request(app)
        .post(`${baseUrl}/user/signup/fal`)
        .set('authorization', `Bearer ${adminToken}`)
        .send(users[8])
        .end((err, res) => {
          expect(res.body.error[0]).to.equal('isAdmin must be one of [true, false]');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('POST/user', () => {
    it('should get a logged in user details', (done) => {
      chai.request(app)
        .get(`${baseUrl}/user`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('POST/accounts', () => {
    it('should create an account for a user', (done) => {
      chai.request(app)
        .post(`${baseUrl}/accounts`)
        .set('authorization', `Bearer ${userToken}`)
        .send(accounts[0])
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should return an error for an invalid field', (done) => {
      chai.request(app)
        .post(`${baseUrl}/accounts`)
        .set('authorization', `Bearer ${userToken}`)
        .send(accounts[1])
        .end((err, res) => {
          expect(res.body.error[0]).to.equal('type must be one of [savings, current]');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not create an account for an invalid token', (done) => {
      chai.request(app)
        .post(`${baseUrl}/accounts`)
        .set('authorization', 'Bearer owewhifogfoWGDEO')
        .send(accounts[0])
        .end((err, res) => {
          expect(res.body.error).to.equal('Unauthorized user');
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it('should not create an account for an Unauthorized user', (done) => {
      chai.request(app)
        .post(`${baseUrl}/accounts`)
        .send(accounts[0])
        .end((err, res) => {
          expect(res.body.error).to.equal('Authorization error');
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it('should not create an account for any other user other than the client', (done) => {
      chai.request(app)
        .post(`${baseUrl}/accounts`)
        .set('authorization', `Bearer ${adminToken}`)
        .send(accounts[0])
        .end((err, res) => {
          expect(res.body.error).to.equal('Forbidden, You Are not allowed to perform this action');
          expect(res.statusCode).to.equal(403);
          done();
        });
    });
  });

  describe('PATCH/accounts/accountNumber', () => {
    it('should activate a user account', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/account/1010101010`)
        .set('authorization', `Bearer ${adminToken}`)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should activate a user account', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/account/1010101010112`)
        .set('authorization', `Bearer ${adminToken}`)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.body.error).to.equal('AccountNumber should be 10 digits');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should allow only admin/staff to perform action', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/account/1010101010`)
        .set('authorization', `Bearer ${userToken}`)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.body.error).to.equal('Forbidden, You Are not allowed to perform this action');
          expect(res.statusCode).to.equal(403);
          done();
        });
    });

    it('should flag an error is the account number does not exist', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/account/2010101017`)
        .set('authorization', `Bearer ${adminToken}`)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.body.error).to.equal('Account not found');
          expect(res.statusCode).to.equal(404);
          done();
        });
    });

    it('should flag an error is the account number is not correctly entered', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/account/10101advovno`)
        .set('authorization', `Bearer ${adminToken}`)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.body.error[0]).to.equal('accountNumber must be a number');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('DELETE/accounts/accountnumber', () => {
    it('should delete a user account', (done) => {
      chai.request(app)
        .delete(`${baseUrl}/accounts/1010101010`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.body.message).to.equal('Account successfully deleted');
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should flag an error for an incorrect account number', (done) => {
      chai.request(app)
        .delete(`${baseUrl}/accounts/1010101010990`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.body.error).to.equal('AccountNumber should be 10 digits');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should allow only admin/staff to perform action', (done) => {
      chai.request(app)
        .delete(`${baseUrl}/accounts/1010101011`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.error).to.equal('Forbidden, You Are not allowed to perform this action');
          expect(res.statusCode).to.equal(403);
          done();
        });
    });

    it('should flag an error is the account number does not exist', (done) => {
      chai.request(app)
        .delete(`${baseUrl}/accounts/2010101010`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.body.error).to.equal('Account not found');
          expect(res.statusCode).to.equal(404);
          done();
        });
    });

    it('should flag an error if the account number is not correctly entered', (done) => {
      chai.request(app)
        .delete(`${baseUrl}/accounts/101010ugwgidus`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.body.error[0]).to.equal('param must be a number');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('POST/transactions/:accountnumber/debit and credit', () => {
    it('should debit a user account', (done) => {
      chai.request(app)
        .post(`${baseUrl}/transactions/1010101011/debit`)
        .send({ amount: 3000 })
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should return an error for an invalid account number', (done) => {
      chai.request(app)
        .post(`${baseUrl}/transactions/1010101011333/debit`)
        .send({ amount: 3000 })
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.body.error).to.equal('AccountNumber should be 10 digits');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should credit a user account', (done) => {
      chai.request(app)
        .post(`${baseUrl}/transactions/1010101011/credit`)
        .send({ amount: 3000 })
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should credit a user account', (done) => {
      chai.request(app)
        .post(`${baseUrl}/transactions/1010101011/credit`)
        .send({ amount: 3000, description: 'For food and drinks' })
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should allow only staff to perform action', (done) => {
      chai.request(app)
        .post(`${baseUrl}/transactions/1010101011/debit`)
        .set('authorization', `Bearer ${adminToken}`)
        .send({ amount: 3000 })
        .end((err, res) => {
          expect(res.body.error).to.equal('Forbidden, You Are not allowed to perform this action');
          expect(res.statusCode).to.equal(403);
          done();
        });
    });

    it('should flag an error is the account number does not exist', (done) => {
      chai.request(app)
        .post(`${baseUrl}/transactions/2010101111/debit`)
        .set('authorization', `Bearer ${staffToken}`)
        .send({ amount: 3000 })
        .end((err, res) => {
          expect(res.body.error).to.equal('Account not found');
          expect(res.statusCode).to.equal(404);
          done();
        });
    });

    it('should not perform a debit transaction on a dormant account', (done) => {
      chai.request(app)
        .post(`${baseUrl}/transactions/1010101014/debit`)
        .set('authorization', `Bearer ${staffToken}`)
        .send({ amount: 3000 })
        .end((err, res) => {
          expect(res.body.error).to.equal('cannot perform transaction on dormant account');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should flag an error when the debit balance is less than the amount', (done) => {
      chai.request(app)
        .post(`${baseUrl}/transactions/1010101015/debit`)
        .set('authorization', `Bearer ${staffToken}`)
        .send({ amount: 5000 })
        .end((err, res) => {
          expect(res.body.error).to.equal('insuffcient fund');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should flag an error is the account number is not correctly entered', (done) => {
      chai.request(app)
        .post(`${baseUrl}/transactions/101010ugwgidus/debit`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.error[0]).to.equal('amount is required');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('GET/accounts/<account-number>/transactions', () => {
    it('Get all transactions for a user account number', (done) => {
      chai.request(app)
        .get(`${baseUrl}/accounts/1010101011/transactions`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('Should not get transactions for a user whose logged in, but is not the owner of the account number', (done) => {
      chai.request(app)
        .get(`${baseUrl}/accounts/1010101019/transactions`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.error).to.equal('Account 1010101019 does not belong to this User');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('Get all transactions for a users account number', (done) => {
      chai.request(app)
        .get(`${baseUrl}/accounts/1010101011/transactions`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should flag an error if the account number does not exist', (done) => {
      chai.request(app)
        .get(`${baseUrl}/accounts/2010101111/transactions`)
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.body.error).to.equal('Account not found');
          expect(res.statusCode).to.equal(404);
          done();
        });
    });

    it('should flag an error if there are no transactions for that account', (done) => {
      chai.request(app)
        .get(`${baseUrl}/accounts/1010101015/transactions`)
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.body.error).to.equal('No transactions for this account');
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  describe('GET/transactions/:id', () => {
    it('should return a specific transaction', (done) => {
      chai.request(app)
        .get(`${baseUrl}/transactions/6`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should not return an account transaction to an user who doesnt own the account', (done) => {
      chai.request(app)
        .get(`${baseUrl}/transactions/9`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.error).to.equal('Account Transaction does not belong to this User');
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should return an account transaction to the owner of the account', (done) => {
      chai.request(app)
        .get(`${baseUrl}/transactions/6`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should flag an error for an incorrectly typed id', (done) => {
      chai.request(app)
        .get(`${baseUrl}/transactions/vw`)
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.body.error[0]).to.equal('param must be a number');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should flag an error if the transaction does not exist', (done) => {
      chai.request(app)
        .get(`${baseUrl}/transactions/100`)
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.body.error).to.equal('Transaction not found');
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  describe('GET/user/:email/accounts', () => {
    it('should return all Accounts owned by the user specified', (done) => {
      chai.request(app)
        .get(`${baseUrl}/user/kelv@gmail.com/accounts`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should flag an error if the transaction does not exist', (done) => {
      chai.request(app)
        .get(`${baseUrl}/transactions/100`)
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.body.error).to.equal('Transaction not found');
          expect(res.statusCode).to.equal(404);
          done();
        });
    });

    it('should flag an error for an incorrect email', (done) => {
      chai.request(app)
        .get(`${baseUrl}/user/kelvgmaicom/accounts`)
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.body.error[0]).to.equal('email must be a valid email');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('GET/accounts/:accountNumber', () => {
    it('should return a specific account details', (done) => {
      chai.request(app)
        .get(`${baseUrl}/accounts/1010101019`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should return only the specific details on an account to the owner', (done) => {
      chai.request(app)
        .get(`${baseUrl}/accounts/1010101011`)
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should flag an error is the account number does not exist', (done) => {
      chai.request(app)
        .get(`${baseUrl}/accounts/10101`)
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.body.error).to.equal('Account not found');
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  describe('GET/accounts', () => {
    it('should return all account numbers', (done) => {
      chai.request(app)
        .get(`${baseUrl}/accounts`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should return all active account numbers', (done) => {
      chai.request(app)
        .get(`${baseUrl}/accounts?status=active`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.body.data[0].status).to.equal('active');
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should return all active account numbers', (done) => {
      chai.request(app)
        .get(`${baseUrl}/accounts?status=dormant`)
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.body.data[0].status).to.equal('dormant');
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('PATCH/image', () => {
    it('should Upload an image for a user', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/image`)
        .set('authorization', `Bearer ${userToken}`)
        .send({ profilePic: 'https://i.imgur.com/jIsCg.jpg' })
        .end((err, res) => {
          expect(res.body.data).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should Return an error for an invalid image url', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/image`)
        .set('authorization', `Bearer ${userToken}`)
        .send({ profilePic: 'https://i.imgur.co' })
        .end((err, res) => {
          expect(res.body.error[0]).to.equal('profilePic should be of form https://i.imgur.com/image.extension');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });
});
