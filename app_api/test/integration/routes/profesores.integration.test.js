// yarn add mocha chai fakerjs request chai-http sinonjs nock leakage
//https://github.com/thinkjs/thinkjs/blob/master/test/case/application.js
//https://github.com/actionhero/actionhero/blob/master/test/servers/web.js
// https://github.com/waldemarnt/testable-nodejs-api

// feathersjs, actoinhero, thinkjs, sails, loopback,

describe('Profesores', () => {
    before((done) => {
      app.listen(app.get('port'))
      done()
    });
    after(function () {
      process.exit(0)
    });
    describe('/GET profesores', () => {
        it('este debera retornar todos los profesores', (done) => {
              chai.request(app)
              .get('/api/profesores')
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                done();
              });
        });
    });
})