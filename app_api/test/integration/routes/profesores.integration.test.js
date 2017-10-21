var app = require('../../../../app')
var request = require('supertest')
var sinon = require('sinon')
var assert = require('assert')
var test = require('ava').test

test.before(t => {
  app.listen(app.get('port'))
  t.pass()
})

test('/GET ObtenerTodosProfesores', async t => {
  const res = await request(app).get('/api/profesores')
  t.is(res.status, 200)
  t.true(Array.isArray(res.body))
  t.pass();
})