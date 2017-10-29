// aqui se haran las llamadas a la base de datos
// No olvidar colocar los logs con winston

const obtenerTodosProfesores = () => {
  return new Promise((resolve, reject) => {
    db.select().from('profesores').then((profesores) => {
      return resolve(profesores)
    }).catch((error) => {
      logger.info(error)
      logger.error(`Profesor model Error ${error}`)
      reject(error)
    })
  })
}

module.exports = {
  obtenerTodosProfesores,
}
