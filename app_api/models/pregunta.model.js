/* eslint comma-dangle: ["error", "never"] */
/**
* @name Pregunta
* @author Edison Mora
*/

/**
  * Obtiene todas las preguntas de la base de datos
  * @return {Promise} preguntas en formato json, si no lo encuentra devuelve un json vacio
  * @error {Error} error object
  * @author Edison Mora
 */
module.exports.getAll = () => {
  return new Promise((resolve, reject) => {
      db.from('preguntas')
      .select()
      .then((preguntas) => {
        resolve(preguntas)
      })
      .catch((error) => {
        logger.info(error)
        logger.error(`Pregunta model Error ${error}`)
        reject(error)
      })
    })
}

/**
  * Obtiene la pregunta indicada por el id
  * @param {idPregunta}
  * @return {Promise} pregunta en formato json, si no lo encuentra devuelve un json vacio
  * @error {Error} error object
  * @author Edison Mora
*/
module.exports.getById = (idPregunta) => {
  return new Promise( (resolve, reject) => {
    db.from('preguntas')
      .select()
      .where({
        'preguntas.id' : idPregunta
      })
      .first()
      .then( pregunta => {
        resolve(pregunta);
      })
      .catch( error => {
        logger.info(error)
        logger.error(`Pregunta model Error ${error}`)
        reject(error)
      });
  });
}

module.exports.insert = (pregunta, trx) => {
  return new Promise((resolve, reject) => {
    db.insert(pregunta)
      .into('preguntas')
      .transacting(trx)
      .then((id) => {
        resolve(id)
      })
      .catch((error) => {
        logger.info(error)
        logger.error(`Pregunta model Error ${error}`)
        reject(error)
      })
  })
}

module.exports.delete = (idPregunta) => {
  return new Promise((resolve, reject) => {
    db('preguntas')
      .where({
        'preguntas.id' : idPregunta
      })
      .del()
      .then((resultado) => {
        resolve(resultado)
      })
      .catch((error) => {
        logger.info(error)
        logger.error(`Pregunta model Error ${error}`)
        reject(error)
      })
  })
}