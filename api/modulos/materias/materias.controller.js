const responses = require('../../config/responses')

module.exports = ({ db }) => {
  const proto = {
    async ObtenerTodos () {
      let materias = await db.materias.ObtenerTodos()
      return responses.OK(materias)
    },
    async Crear (datos) {
      let materia = new db.materias(datos)
      let materiaCreada = await materia.Crear()
      return responses.OK(materiaCreada)
    }
  }
  return Object.assign(Object.create(proto), {})
}