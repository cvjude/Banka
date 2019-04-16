import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import users from './testdata/user';

// let userToken;

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
          // userToken = res.body.data.token;
          expect(res.statusCode).to.equal(201);
          done();
        });
    });

    it('should not sign up an existing user', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signup`)
        .send(users[1])
        .end((err, res) => {
          expect(res.statusCode).to.equal(409);
          done();
        });
    });

    it('should return an error for an invalid field', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signup`)
        .send(users[2])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should return an error for a numeric input in a numeric field', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signup`)
        .send(users[3])
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });
});
