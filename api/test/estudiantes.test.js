process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err)
  console.error(err.stack)
})


const request = require('supertest')
const sinon = require('sinon')
const expect = require("chai").expect
const co = require('co')

const db = require('../config/db').knex

describe('Controller', () =>  {
  before(async () => {
    await db.Crear()
    await db.Conectar()
  })
  after(async () => {
    await db.Desconectar()
  })
  it('Prueba', (done) => {
    expect(1).to.equal(1)
    done()
  })
})