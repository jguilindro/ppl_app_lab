describe('Profesores', () => {
  after(() => {
    //1process.exit(0)
  })
  it('GET todos los profesores', (done) => {
    request(app)
      .get('/api/profesores')
      .end(function(err, res) {
        assert.equal(Array.isArray(res.body),true, 'foo is a string')
        done()
      })
  })
  it('GET todos los profesores', (done) => {
    assert.equal('sad','sad', 'foo is a string')
    done()
  })
})