import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import users from './testdata/user';
import accounts from './testdata/accounts';

let userToken;
let adminToken;
let staffToken;

const { expect } = chai;
chai.use(chaiHttp);

describe('Banka App', () => {
  describe('/display welcome message', () => {
    it('display welcome message on start', (done) => {
      chai.request(app)
        .get('/api/v1/')
        .end((err, res) => {
          expect(res.body.message).to.equal('welcome to the Banka app');
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('throw an error for an invalid url', (done) => {
      chai.request(app)
        .get('/api/v1/jdfsdfaoioh')
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  describe('POST/auth signup', () => {
    it('should signup a non existing user(client)', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(users[4])
        .end((err, res) => {
          userToken = res.body.data.token;
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should not sign up an existing user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(users[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(409);
          done();
        });
    });

    it('should return an error for an invalid field', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(users[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should return an error for a numeric input in a numeric field', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(users[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('POST/auth signin', () => {
    it('should signin an existing user(Admin)', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(users[6])
        .end((err, res) => {
          adminToken = res.body.data.token;
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should signin an existing user(Staff)', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(users[7])
        .end((err, res) => {
          staffToken = res.body.data.token;
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should not signin on invalid user input', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(users[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not signin on invalid email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(users[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not signin on invalid password', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(users[5])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('POST/accounts', () => {
    it('should create an account for a user', (done) => {
      chai.request(app)
        .post('/api/v1/accounts')
        .set('authorization', `Bearer ${userToken}`)
        .send(accounts[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should return an error for an invalid field', (done) => {
      chai.request(app)
        .post('/api/v1/accounts')
        .set('authorization', `Bearer ${userToken}`)
        .send(accounts[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not create an account for an invalid token', (done) => {
      chai.request(app)
        .post('/api/v1/accounts')
        .set('authorization', 'Bearer owewhifogfoWGDEO')
        .send(accounts[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it('should create an account for an Unauthorized user', (done) => {
      chai.request(app)
        .post('/api/v1/accounts')
        .send(accounts[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it('should not create an account for any other user other than the client', (done) => {
      chai.request(app)
        .post('/api/v1/accounts')
        .set('authorization', `Bearer ${adminToken}`)
        .send(accounts[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          done();
        });
    });
  });

  describe('PATCH/accounts/accountNumber', () => {
    it('should activate a user account', (done) => {
      chai.request(app)
        .patch('/api/v1/account/1010101010')
        .set('authorization', `Bearer ${adminToken}`)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should allow only admin/staff to perform action', (done) => {
      chai.request(app)
        .patch('/api/v1/account/1010101010')
        .set('authorization', `Bearer ${userToken}`)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          done();
        });
    });

    it('should flag an error is the account number does not exist', (done) => {
      chai.request(app)
        .patch('/api/v1/account/1010101017')
        .set('authorization', `Bearer ${userToken}`)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should flag an error is the account number is not correctly entered', (done) => {
      chai.request(app)
        .patch('/api/v1/account/10101advovno')
        .set('authorization', `Bearer ${userToken}`)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('DELETE/accounts/accountnumber', () => {
    it('should delete a user account', (done) => {
      chai.request(app)
        .delete('/api/v1/accounts/1010101010')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should allow only admin/staff to perform action', (done) => {
      chai.request(app)
        .delete('/api/v1/accounts/1010101011')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          done();
        });
    });

    it('should flag an error is the account number does not exist', (done) => {
      chai.request(app)
        .delete('/api/v1/accounts/10101010177')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should flag an error is the account number is not correctly entered', (done) => {
      chai.request(app)
        .delete('/api/v1/accounts/101010ugwgidus')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('POST/transactions/:accountnumber/debit and credit', () => {
    it('should debit a user account', (done) => {
      chai.request(app)
        .post('/api/v1/transactions/1010101011/debit')
        .send({ amount: 3000 })
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should credit a user account', (done) => {
      chai.request(app)
        .post('/api/v1/transactions/1010101011/credit')
        .send({ amount: 3000 })
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should allow only staff to perform action', (done) => {
      chai.request(app)
        .post('/api/v1/transactions/1010101011/debit')
        .set('authorization', `Bearer ${adminToken}`)
        .send({ amount: 3000 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          done();
        });
    });

    it('should flag an error is the account number does not exist', (done) => {
      chai.request(app)
        .post('/api/v1/transactions/1010101111/debit')
        .set('authorization', `Bearer ${staffToken}`)
        .send({ amount: 3000 })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should flag an error is the account number is not correctly entered', (done) => {
      chai.request(app)
        .post('/api/v1/transactions/101010ugwgidus/debit')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });
});
