const EstudianteModel = require('../models/estudiante.model');
const ParaleloModel = require('../models/paralelo.model');
const LeccionModel = require('../models/leccion.model');
const GrupoModel = require('../models/grupo.model');
const co = require('co')

var respuesta = require('../utils/responses');
/*
* Estudiante metodos basicos
*/
const obtenerTodosEstudiantes = (req, res) => {
  EstudianteModel.obtenerTodosEstudiantes((err, estudiantes) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, estudiantes);
  })
}

const crearEstudiante = (req, res) => {
  let estudiante = new EstudianteModel({
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    correo: req.body.correo,
    matricula: req.body.matricula
  })
  estudiante.crearEstudiante((err) => {
    if (err) return respuesta.serverError(res);
    return respuesta.creado(res, estudiante);
  })
}

const obtenerEstudiante = (req, res) => {
	EstudianteModel.obtenerEstudiante(req.params.id_estudiante, (err, estudiante) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, estudiante);
  })
}

const tomarLeccion = (req, res) => {
  function obtenerParaleloDeEstudiante(_id) {
    return new Promise((resolve, reject) => {
      ParaleloModel.obtenerParaleloDeEstudiante(_id, (err ,paralelo) => {
        if (err) reject(new Error('erro al obtener estudiante'))
        resolve(paralelo)
      })
    })
  }
  function obtenerGrupoDeEstudiante(_id) {
    return new Promise((resolve, reject) => {
      GrupoModel.obtenerGrupoDeEstudiante(_id, (err, grupo) => {
        if (err) reject(new Error('erro al obtener grupo estudiante'))
        resolve(grupo)
      })
    })
  }

  function obtenerLeccionPorCodigo(codigo_leccion) {
    return new Promise((resolve, reject) => {
      LeccionModel.obtenerLeccionPorCodigo(codigo_leccion, (err, leccion) => {
        if (err) reject(new Error('erro al obtener leccion estudiante'))
        resolve(leccion)
      })
    })
  }

  function ingresadocodigoLeccion(_id) {
    return new Promise((resolve, reject) => {
      EstudianteModel.codigoLeccion(_id, (err, anadido) => {
        if (err) return reject(new Error('Erro al ingresar codigo'))
        return resolve(true)
      })
    })
  }

  function anadirEstudianteDandoLeccion(id_estudiante, id_leccion) {
    return new Promise((resolve, reject) => {
      EstudianteModel.anadirEstudianteDandoLeccion(id_estudiante, id_leccion, (err, res) => {
        if (err) return reject(new Error('Erro al anadir estudiante dando leccion'))
        return resolve(true)
      })
    })
  }

  function anadirLeccionActualDando(id_estudiante, id_leccion) {
    return new Promise((resolve, reject) => {
      EstudianteModel.anadirLeccionActualDando(id_estudiante, id_leccion, (err, res) => {
        if (err) return reject(new Error('Erro al anadir estudiante actual dando'))
        return resolve(true)
      })
    })
  }

  var { _id } = req.session
  var { codigo_leccion } = req.params
  co(function* () {
    var paralelo = yield obtenerParaleloDeEstudiante(_id)
    var grupo = yield obtenerGrupoDeEstudiante(_id)
    if (!grupo) {
      // No tiene paralelo
      respuesta.ok(res, {tieneGrupo: false, paraleloDandoLeccion: false, codigoLeccion: false, leccionYaComenzo: false})
      return
    } else {
      if (paralelo.dandoLeccion) {
        var leccion = yield obtenerLeccionPorCodigo(codigo_leccion)
        if (!leccion) {
          // Tiene grupo, el paralelo esta dando leccion, codigo leccion mal ingresado
          respuesta.ok(res, {tieneGrupo: true, paraleloDandoLeccion: true, codigoLeccion: false, leccionYaComenzo: false})
          return
        } else {
          var dando_leccion = yield anadirLeccionActualDando(_id, leccion._id)
          var set_est_leccion = yield anadirEstudianteDandoLeccion(_id, leccion._id)
          if (paralelo.leccionYaComenzo) {
            // Tiene grupo, el paralelo esta dando leccion, ingreso bien el codigo leccion, leccion ya comenzo
            var codigo_valido = ingresadocodigoLeccion(_id)
            respuesta.ok(res, {tieneGrupo: true, paraleloDandoLeccion: true, codigoLeccion: true, leccionYaComenzo: true})
          } else {
            // Tiene grupo, el paralelo esta dando leccion, ingreso bien el codigo leccion, leccion no ha empezado
            var codigo_valido = ingresadocodigoLeccion(_id)
            respuesta.ok(res, {tieneGrupo: true, paraleloDandoLeccion: true, codigoLeccion: true, leccionYaComenzo: false})
          }
        }
      } else {
        // Tiene grupo pero no tiene lecciones por dar
        respuesta.ok(res, {tieneGrupo: true, paraleloDandoLeccion: false, codigoLeccion: false, leccionYaComenzo: false})
      }
    }
  }).catch(fail => console.log(fail))
}


const verificarPuedeDarLeccion = (id_estudiante, callback) => {
  EstudianteModel.veficarPuedeDarLeccion(id_estudiante, (err, estudiante) => {
    if (err) return callback(err)
    return callback(estudiante.dandoLeccion)
  })
}

const calificarLeccion = (req, res) => {
  EstudianteModel.calificarLeccion(req.params.id_estudiante, req.params.id_leccion, req.body.calificacion, (err, doc) => {
    if (!doc.nModified) return respuesta.mongoError(res, 'La leccion no existe');
    if(err) return respuesta.serverError(res);
    return respuesta.okActualizado(res);
  })
}

module.exports = {
	obtenerTodosEstudiantes,
	crearEstudiante,
	obtenerEstudiante,
  // leccion
  verificarPuedeDarLeccion,
  calificarLeccion,
  tomarLeccion
}
