const LeccionModel = require('../models/leccion.model');
const ParaleloModel = require('../models/paralelo.model');
const EstudianteModel = require('../models/estudiante.model');
var respuesta = require('../utils/responses');

const obtenerTodasLecciones = (req, res) => {
  LeccionModel.obtenerTodasLecciones((err, lecciones) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res,lecciones);
  })
}

const obtenerLeccionesParalelo = (req, res) => {
  LeccionModel.obtenerLeccionesParalelo(id_paralelo, (err, leccion) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res,leccion);
  })
}

const obtenerLeccion = (req, res) => {
  const { id_leccion } = req.params
  LeccionModel.obtenerLeccion(id_leccion, (err, leccion) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res,leccion);
  })
}

// TODO: anadir el creador con el login
const crearLeccion = (req, res) => {
  let leccion = new LeccionModel({
    creador: req.session._id,
    nombre: req.body.nombre,
    tiempoEstimado: req.body.tiempoEstimado,
    puntaje: parseInt(req.body.puntaje),
    tipo: req.body.tipo,
    fechaInicio: req.body.fechaInicio,
    preguntas: req.body.preguntas,
    paralelo: req.body.paralelo,
    nombreParalelo: req.body.nombreParalelo,
    nombreMateria: req.body.nombreMateria,
    codigoMateria: req.body.codigoMateria
  })
  leccion.crearLeccion((err, doc) => {
    if (err) {
      console.log(err);
      return respuesta.serverError(res);
    }
    return respuesta.creado(res, leccion);
  })
}

const actualizarLeccion = (req, res) => {
  const actualizar = {
    nombre: req.body.nombre,
    tiempoEstimado: req.body.tiempoEstimado,
    puntaje: req.body.puntaje,
    tipo: req.body.tipo,
    fechaInicio: req.body.fechaInicio,
    paralelo: req.body.paralelo,
    nombreParalelo: req.body.nombreParalelo,
    codigoMateria: req.body.codigoMateria,
    nombreMateria: req.body.nombreMateria,
    preguntas: req.body.preguntas
  }
  const { id_leccion } = req.params
  LeccionModel.actualizarLeccion(id_leccion, actualizar, (err, doc) => {
    if (err) return respuesta.serverError(res);
    return respuesta.okActualizado(res);
  })
}

const eliminarLeccion = (req, res) => {
  const { id_leccion } = req.params
  LeccionModel.eliminarLeccion(id_leccion, (err, doc) => {
    if (err) return respuesta.serverError(res);
    return respuesta.okEliminado(res);
  })
}

// Lecciones realtime
const tomarLeccion = (req, res) => {
  const { id_leccion } = req.params
  LeccionModel.tomarLeccion(id_leccion, (err, docs) => {
    if (err) return respuesta.serverError(res);
    return respuesta.okActualizado(res);
  })
}


const comenzarLeccion = (req, res) => {
  const { id_leccion } = req.params
  LeccionModel.comenzarLeccion(id_leccion, (err, docs) => {
    if (err) return respuesta.serverError(res);
    return respuesta.okActualizado(res);
  })
}

const leccionYaComenzo = (req, res) => {
}

const habilitarEstudiantesCursoParaLeccion = (req, res) => {
  const { id_paralelo } = req.params
  var estudiantes = []
  var promise
  ParaleloModel.obtenerParalelo(id_paralelo, (err, paralelo) => {
    if (err) return respuesta.serverError(res);
    estudiantes = paralelo.estudiantes
    var promises = []
    estudiantes.forEach(est => {
      promises.push(new Promise((resolve, reject) => {
        EstudianteModel.anadirEstudianteDandoLeccion(est._id, (err, estudiante) => {
          if (err) return reject('error anadir estudiante dando leccion')
          if (!estudiante) return resolve(false)
          resolve(true)
        })
      }))
    })
    Promise.all(promises)
      .then(result => {
        respuesta.okActualizado(res)
      }, fail => {
        console.log(fail)
        respuesta.noOk(res)
      })
  })
}

const anadirTiempo = (req, res) => {
  LeccionModel.aumentarTiempo(req.params.id_leccion, req.body.tiempo, (err, aa) => {
    if (err) return respuesta.serverError(res);
    return respuesta.okActualizado(res);
  })
}

module.exports = {
  crearLeccion,
  obtenerTodasLecciones,
  obtenerLeccion,
  actualizarLeccion,
  eliminarLeccion,
  // realtime
  tomarLeccion,
  anadirTiempo,
  comenzarLeccion,
  habilitarEstudiantesCursoParaLeccion,
  obtenerLeccionesParalelo
}
