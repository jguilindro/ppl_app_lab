const EstudianteModel = require('../models/estudiante.model');
const ParaleloModel = require('../models/paralelo.model');
const LeccionModel = require('../models/leccion.model');
const GrupoModel = require('../models/grupo.model');
const PreguntaModel = require('../models/pregunta.model');
const RespuestaModel = require('../models/respuestas.model');
const CalificacionModel = require('../models/calificacion.model')
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

  function leccionYaAnadida(id_estudiante, id_leccion) {
    return new Promise((resolve, reject) => {
      EstudianteModel.leccionYaAnadida(id_estudiante, id_leccion, (err, res) => {
        if (err) return reject(new Error('Erro al anadir estudiante actual dando'))
        if (res) return resolve(true)
        return resolve(false)
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
        if (!leccion || leccion._id != paralelo.leccion) {
          // Tiene grupo, el paralelo esta dando leccion, codigo leccion mal ingresado y si el codigo es de otro curso
          respuesta.ok(res, {tieneGrupo: true, paraleloDandoLeccion: true, codigoLeccion: false, leccionYaComenzo: false})
          return
        } else {
          var ya_anadido = yield leccionYaAnadida(_id, leccion._id)
          if (!ya_anadido) {
            var dando_leccion = yield anadirLeccionActualDando(_id, leccion._id)
            var set_est_leccion = yield anadirEstudianteDandoLeccion(_id, leccion._id)
          }
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

const leccionDatos = (req, res) => {
  function buscarEstudiante(id_estudiante) {
    return new Promise((resolve, reject) => {
      // obtendo datos estudiante
      EstudianteModel.obtenerEstudianteNoPopulate(id_estudiante, (err, est) => {
        if (err) return reject(new Error('No se pudo obtener estudiante'))
        return resolve(est)
      })
    })
  }

  function buscarGrupo(id_estudiante) {
    return new Promise((resolve, reject) => {
      // obtengo el grupo del estudiante
      GrupoModel.obtenerGrupoDeEstudiante(id_estudiante, (err, grupo) => {
        if (err) return reject(new Error('No se pudo obtener grupo estudiante'))
        return resolve(grupo)
      })
    })
  }

  function buscarParalelo(id_estudiante) {
    return new Promise((resolve, reject) => {
      // obtener el pralelo del estudiante
      ParaleloModel.obtenerParaleloDeEstudiante(id_estudiante, (err, paralelo) => {
        if (err) return reject(new Error('No se puedo obtener grupo estudiante'))
        return resolve(paralelo)
      })
    })
  }

  function obtenerLeccion(id_leccion) {
    return new Promise((resolve, reject) => {
      // obtengo la leccion con las preguntas
      LeccionModel.obtenerLeccionPopulate(id_leccion, (err, leccion) => {
        if (err) return reject(new Error('No se puedo obtener Leccion'))
        return resolve(leccion)
      })
    })
  }

  function obtenerRespuestas(id_leccion, id_estudiante) {
    return new Promise((resolve, reject) => {
      RespuestaModel.obtenerRespuestasDeEstudiante(id_leccion, id_estudiante, (err ,respues) => {
        if (err) return reject(new Error('No se puedo obtener Respuesta estudiante'))
        return resolve(respues)
      })
    })
  }

  function anadirParticipanteARegistro(id_leccion,id_grupo, id_estudiante) {
    return new Promise((resolve, reject) => {
      CalificacionModel.anadirParticipante(id_leccion,id_grupo, id_estudiante, (err, doc) => {
    		if(err) return reject(new Error('Error al anadir participante'));
    		return resolve(true)
    	});
    })
  }

  function anadirLeccionYaComenzo(id_estudiante) {
    return new Promise((resolve, reject) => {
      EstudianteModel.anadirLeccionYaComenzo(id_estudiante, (err, res) => {
        if (err) return reject(new Error('Erro al anadir leccion ya comenzo'))
        if (res) return resolve(true)
        return resolve(false)
      })
    })
  }

  co(function* () {
    var id_estudiante = req.session._id
    var leccionYaComenzo = anadirLeccionYaComenzo(id_estudiante)
    var estudiante = yield buscarEstudiante(id_estudiante)
    var grupo = yield buscarGrupo(id_estudiante)
    var paralelo = yield buscarParalelo(id_estudiante)
    var leccion = yield obtenerLeccion(estudiante.leccion)
    var respuestas = yield obtenerRespuestas(estudiante.leccion, id_estudiante)
    var anadido = yield anadirParticipanteARegistro(estudiante.leccion, grupo._id, id_estudiante)
    respuesta.ok(res, {estudiante: estudiante, grupo: grupo, paralelo: paralelo, leccion: leccion, respuestas: respuestas, anadidoARegisto: anadido})
  })

}

module.exports = {
	obtenerTodosEstudiantes,
	crearEstudiante,
	obtenerEstudiante,
  // leccion
  verificarPuedeDarLeccion,
  calificarLeccion,
  tomarLeccion,
  leccionDatos
}
