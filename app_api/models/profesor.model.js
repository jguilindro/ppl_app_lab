// aqui se haran las llamadas a la base de datos
// No olvidar colocar los con wind

const obtenerTodosProfesores = function() {
  return new Promise((resolve, reject) => {
    db.select().from('profesores').then(function(profesores) {
      resolve(profesores)
    }).catch (error => {
      logger.info(error)
      logger.error(`Profesor model Error ${error}`)
      reject(error)
    })
  })
}

module.exports = {
  obtenerTodosProfesores
}