module.exports = {
  OBTENER_TODOS: {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            estado: { type: 'boolean' },
            codigoEstado: { type: 'boolean' }
          }
        }
      }
    }
  }
}