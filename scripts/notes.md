# Como documentar
https://www.sitepoint.com/self-documenting-javascript/
http://usejsdoc.org/about-getting-started.html
https://github.com/apidoc/apidoc
https://github.com/jsdoc3/jsdoc
https://esdoc.org/
https://github.com/documentationjs/documentation/blob/master/docs/GETTING_STARTED.md
```js
/**
 * @file Working with Tags
 * @author Milton Mazzarri <me@milmazz.uno>
 * @version 0.1
 */

/**
   * The Tag definition.
   *
   * @param {String} id - The ID of the Tag.
   * @param {String} description - Concise description of the tag.
   * @param {Number} min - Minimum value accepted for trends.
   * @param {Number} max - Maximum value accepted for trends.
   * @param {Object} plc - The ID of the {@link PLC} object where this tag belongs.
   */
   /**
  * This function adds one to its input.
  * @param {number} input any number
  * @returns {number} that number, plus one.
  */
	 /**
	      * Get the current value of the tag.
	      *
	      * @see [Example]{@link http://example.com}
	      * @returns {Number} The current value of the tag.
	      */
/**
 * Wrap the given generator `fn` into a
 * function that returns a promise.
 * This is a separate function so that
 * every `co()` call doesn't create a new,
 * unnecessary closure.
 *
 * @param {GeneratorFunction} fn
 * @return {Function}
 * @api public
 */

 /**
  * Execute the generator function or a generator
  * and return a promise.
  *
  * @param {Function} fn
  * @return {Promise}
  * @api public
  */

/**
    * @param {Error} err
    * @return {Promise}
    * @api private
    */


/**
   * Get the next value in the generator,
   * return a promise.
   *
   * @param {Object} ret
   * @return {Promise}
   * @api private
   */

/**
* Convert a `yield`ed value into a promise.
*
* @param {Mixed} obj
* @return {Promise}
* @api private
*/

/**
 * Convert a thunk to a promise.
 *
 * @param {Function}
 * @return {Promise}
 * @api private
 */

 /**
  * Convert an array of "yieldables" to a promise.
  * Uses `Promise.all()` internally.
  *
  * @param {Array} obj
  * @return {Promise}
  * @api private
  */
```

# Package
"start": "export $(cat .env | xargs) && node ./bin/www",
"set_env": "export $(cat .env | xargs)",
"switch_to_dev": "export $(cat .env | xargs) && wget --spider https://api.telegram.org/bot$TOKEN/setWebhook?url= --delete-after && node ./bin/www"

```js
function comenzar(profe) {
  co(function *() {
      const COOKIE = socket.user
      const profesor = yield obtenerProfesor(COOKIE, socket)
      const estudiante = yield obtenerEstudiante(COOKIE)
      const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
      if (profesor && (profe || PARALELO.leccionYaComenzo)) {
        console.log('----- profesor --------');
        const HORA_LOCAL = moment();
        const CURRENT_TIME_GUAYAQUIL = moment(HORA_LOCAL.tz('America/Guayaquil').format());
        const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
        const LECCION_TOMANDO = yield obtenerLeccion(PARALELO.leccion)
        const INICIO_LECCION = moment(LECCION_TOMANDO.fechaInicioTomada)
        // verificar si ya fue creada
        const leccion_creada = yield leccionYaCreada(LECCION_TOMANDO._id)
        if (!leccion_creada) {
          let leccionRealtime = new LeccionRealtimeModel({
            leccion: LECCION_TOMANDO._id,
            profesor: profesor._id
          })
          const leccion_creada = yield crearLeccionRealtime(leccionRealtime)
        } else {
          let leccionR = yield obtenerLeccionRealtime(PARALELO.leccion)
          setTimeout(function(ee) {
             socket.emit('leccion datos', leccionR)
          }, 1000)
        }
        console.log(`fecha inicio ${INICIO_LECCION.format('YY/MM/DD hh:mm:ss')}`);
        const TIEMPO_MAXIMO = INICIO_LECCION.add(LECCION_TOMANDO.tiempoEstimado, 'm')
        console.log(`tiempo maximo ${TIEMPO_MAXIMO.format('YY/MM/DD hh:mm:ss')}`);
        socket.inteval = setInterval(function() {
          let tiempo_rest = TIEMPO_MAXIMO.subtract(1, 's');
          var duration = moment.duration(tiempo_rest.diff(CURRENT_TIME_GUAYAQUIL)).format("h:mm:ss");
          // console.log(`tiempo restado ${tiempo_rest.format('YY/MM/DD hh:mm:ss')}`);
          // console.log(`tiempo restante ${duration}`);
          // si duracion == 0, limpiar lecciones(dandoLeccion) y estudiantes(dandoLeccion)
          if (!isNaN(duration)) { // FIXME si se recarga la pagina antes que llege a cero continua
            if (parseInt(duration) == 0) {
              clearInterval(socket.inteval);
              leccionTerminada(PARALELO, PARALELO.leccion)
              leccion.in(PARALELO._id).emit('terminado leccion', true)
            }
          }
          leccion.in(PARALELO._id).emit('tiempo restante', duration)
        }, 1000)
      }
      if (estudiante) {
        const GRUPO = yield obtenerGrupo(estudiante)
        const PARALELO = yield obtenerParaleloDeEstudiante(estudiante)
        const LECCION_ID = yield queLeccionEstaDandoEstudiante(estudiante)
        // const PREGUNTA_ID = yield obtenerPreguntaConNumerOrden(LECCION_ID, NUMBER_PREGUNTA)// obtener que pregunta deberia tener este estudiante
        socket.join(GRUPO._id) // unir estudiante al canal grupo
        socket.join(PARALELO._id) // unir al estudiante al canal paralelo
        socket.estudiante = estudiante
        let leccionR = yield obtenerLeccionRealtime(PARALELO.leccion)
        socket.broadcast.emit('estudiante conectado', estudiante) // enviar el estudiante conectador a PROFESOR
        socket.emit('leccion id', LECCION_ID)
      }
  }).catch(fail => console.log(fail))
}
```
