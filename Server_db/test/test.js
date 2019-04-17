import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import users from './testdata/user';
import accounts from './testdata/accounts';

let userToken;
let adminToken;
// let staffToken;

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
  });

  describe('POST/auth signup', () => {
    it('should signup a non existing user(client)', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signup`)
        .send(users[4])
        .end((err, res) => {
          userToken = res.body.data.token;
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
          expect(res.body.error).to.equal('lastName should be a string');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should return an error for a numeric input in a string field', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signup`)
        .send(users[3])
        .end((err, res) => {
          expect(res.body.error).to.equal('firstName should be a string');
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
          expect(res.body).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should signin an existing user(Staff)', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signin`)
        .send(users[7])
        .end((err, res) => {
          // staffToken = res.body.data.token;
          expect(res.body).to.not.equal(null);
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
          expect(res.body.error).to.equal('email must be a valid email');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not signin on invalid password', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signin`)
        .send(users[5])
        .end((err, res) => {
          expect(res.body.error).to.equal('password not correct');
          expect(res.statusCode).to.equal(400);
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
          expect(res.body).to.not.equal(null);
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
          expect(res.body.error).to.equal('type must be one of [savings, current]');
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
          expect(res.body.error).to.equal('Forbidden');
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
          expect(res.body).to.not.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should allow only admin/staff to perform action', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/account/1010101010`)
        .set('authorization', `Bearer ${userToken}`)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.body.error).to.equal('Forbidden');
          expect(res.statusCode).to.equal(403);
          done();
        });
    });

    it('should flag an error is the account number does not exist', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/account/1010101017`)
        .set('authorization', `Bearer ${adminToken}`)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.body.error).to.equal('Account number not found');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should flag an error is the account number is not correctly entered', (done) => {
      chai.request(app)
        .patch(`${baseUrl}/account/10101advovno`)
        .set('authorization', `Bearer ${userToken}`)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.body.error).to.equal('accountNumber must be a number');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });
});
