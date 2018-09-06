const rfr = require('rfr')
const expect = require('chai').expect
const sinon = require('sinon')

const app = rfr('api/app')
const dump = rfr('api/config/dump')
const { URL_DB } = rfr('api/config')
const db = rfr('api/config/db')

describe('MATERIAS', () => {
  let materia1 = dump.materias[0]
  afterEach(async function() {
    await db.Limpiar()
  })
  before('Limpiar la base de datos', async () => {
    await db.Conectar(URL_DB())
  })
  after('Desconectar la base de datos', () => {
    db.Desconectar()
  })

  // CRUD
  it('Crear', async () => {
    let res = await app.inject({ 
      method: 'POST', 
      url: '/api/ppl/materias', 
      payload: materia1
    })
    console.log(res.body)
    // expect(res.body.estado).to.equal(true)
    // expect(res.body.codigoEstado).to.equal(200)
  })

  it('Obtener todas', async () => {
    let res = await app.inject({ method: 'GET', url: '/api/ppl/materias' })
    console.log(res.body)
  })

  it('Actualizar', async () => {

  })

  it('Eliminar', async () => {

  })
})