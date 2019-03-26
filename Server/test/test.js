import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import users from './testdata/user';

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

  describe('/auth signup', () => {
    it('signup a non existing user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(users[0])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should not sign in an existing user', (done) => {
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
});
