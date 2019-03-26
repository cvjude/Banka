import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

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
