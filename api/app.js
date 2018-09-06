const prefix = { prefix: '/api/ppl' }
const { logger } = require('./config')

const Fastify = require('fastify')

const fastify = Fastify(logger())

// rutas api
const materias = require('./modulos/materias/materias.routes')
fastify.register(materias, prefix)

const paralelos = require('./modulos/paralelos/paralelos.routes')

module.exports = fastify