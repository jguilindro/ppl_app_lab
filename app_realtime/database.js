// El objetivo de esto que sea totalmente independiente de el resto de la aplicacion
// faltaria ver como se hara con lo de responder preguntas, si se lo deja como esta o se lo coloca aqui por ser parte de la leccion
// Si la leccion esta pausada y si estaYaCorriendoTiempo, si LeccionYaComenzo, estadoLeccion('pendiente', 'tomando', 'terminado')
// estados leccion
// pendiente, sin-empezar, tomando, pausado, terminado, calificado

// estados estudiante leccion
// ingresando-codigo, esperando-empiece-leccion, dando-leccion
const random = () => {
  let text = ""
  let possible = "0123456789"
  for( var i = 0; i < 7; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

module.exports = ({ LeccionesRealtime, logger, co, moment }) => {
  const proto = {
    copiarLeccionDatos({ leccionId }) { // debe copiarse cuando se crea porque si el estudiante entra antes de que se tome la leccion, no se trackeara
      // tratara de organizar y de copiar los datos de alguna base de datos
    },
    // actualizar los grupos de la leccion o cualquier cosa antes
    // puede ser usada con un boton que diga actualizar, para que cuando el profesor mientras da una leccion
    // actualize los datos de grupos, estudiantes y todo eso
    actualizarLeccion({ leccionId }) {

    },
    estaLogeado({ usuarioId }) { // usado solo para las paginas ingresar-codigo(tomar-leccion), leccion-panel(profesor) y leccion(estudiante)
      // generar el token de sesion con jsonwebtoken de la leccion
    },
    // estudiantes
    verificarCodigo({ codigoLeccion, estudianteId }) { // verifica el codigo del estudiante /api/estudiantes/tomar_leccion/

    },
    obtenerDatosEstudianteIngresarCodigo({ estudianteId }) { // obtiene los datos al iniciar la pagina de ingresar-codigo(tomar-leccion) '/api/paralelos/estudiante/'+ usuario._id,
      // retornara los datos del estudiante si ha ingresado codigo junto con los datos del estado de la leccion 

    },
    obtenerDatosEstudianteLeccion({ paraleloId }) { // /api/estudiantes/leccion/datos_leccion

    },
    // profesores
    // copia los datos necesarios de la leccion en una tabla temporal exclusiva para lecciones realtime
    tomarLeccion({ leccionId }) {

    },
    // copia los datos de la leccion, cuando el profesor la guarda. 
    // TODO: si el profesor elimina la leccion que puede pasar?
    cacheLeccion({ leccionDatos }) {
      return new Promise(function(resolve, reject) {
        let leccion = new LeccionesRealtime(leccionDatos)
        leccion['codigo'] = random()
        leccion.crearLeccion().then(leccionCreda => {
          resolve(leccion['codigo'])
        }).catch(err => logger.error(err))
      })
    },
    obtenerDatosParaLeccionProfesor({ paraleloId }) { // /api/estudiantes/leccion/datos_leccion

    },
    // realtime
    pausarLeccion({ leccionId, paraleloId, usuarioId, usuarioDatos }) {

    },
    continuarLeccion({ leccionId, paraleloId, usuarioId, usuarioDatos }) {

    },
    aumentarTiempoLeccion({ leccionId, paraleloId, usuarioId, usuarioDatos }) {

    },
    terminarLeccion({ leccionId, paraleloId, usuarioId, usuarioDatos }) {
      return new Promise((resolve, reject) => {
       	if (process.env.NODE_ENV !== 'testing')
        	console.log('DB: terminar leccion')
       	resolve(true)	
       })
    },
    profesorSeConecto({ leccionId, usuarioId, dispositivo, socketId }) {

    },
    estudianteSeConecto({ leccionId, paraleloId, usuarioId, socketId, estado, dispositivo }) { 
    },
    obtenerRespuestas({ leccionId }) {

    },
    guardarRespuesta({ leccionId, respuesta }) {

    },
    // test
    obtenerLeccionPorCodigo({ codigo }) {
      return new Promise((resolve, reject) => {
        resolve(LeccionesRealtime.obtenerLeccionPorCodigo({ codigo }))
      })
    }
  }
  return Object.assign(Object.create(proto), {})
}

    // terminarLeccion() {
    //   LeccionModel.leccionTerminada(id_leccion, (err, res) => {
    //     if (err) return console.log(err);
    //     console.log('leccion terminado ' + id_leccion);
    //   })
    //   // cambia valor dandoLeccion en paralelo por false
    //   ParaleloModel.leccionTerminada(paralelo._id, (err, res) => {
    //     if (err) return console.log(err);
    //     console.log('leccion terminada ' + paralelo._id);
    //   })
    //   var promises = []
    //   // anade a cada estudiante la leccion y cambia el boolean dandoLeccion por false
    //   // TODO: anadir fecha empezado leccion
    //   paralelo.estudiantes.forEach(estudiante => {
    //     promises.push(new Promise((resolve, reject) => {
    //       EstudianteModel.leccionTerminada(estudiante._id, (err, e) => {
    //         if (err) return reject(err)
    //         return resolve(true)
    //       })
    //     }))
    //   })
    //   return Promise.all(promises).then(values => {
    //     for (var i = 0; i < values.length; i++) {
    //       if (values[i] != true){
    //         return false
    //       }
    //     }
    //     return true
    //     console.log('terminado leccion estudiantes');
    //   }, fail => {
    //    console.log(fail);
    //   })
    // },