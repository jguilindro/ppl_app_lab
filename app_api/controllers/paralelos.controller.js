const ParaleloModel = require('../models/paralelo.model');
const GrupoModel = require('../models/grupo.model');
var respuesta = require('../utils/responses');
const utils = require('../utils')
var co = require('co')

const obtenerTodosParalelos = (req, res) => {
  ParaleloModel.obtenerTodosParalelos((err,paralelos) => {
    if(err) return respuesta.serverError(res);
    return respuesta.ok(res, paralelos);
  })
}

// TODO: si el paralelo no existe
const obtenerParalelo = (req, res) => {
  ParaleloModel.obtenerParalelo(req.params.id_paralelo, (err, paralelo) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, paralelo)
  })
}

const obtenerParaleloParaLeccion = (req, res) => {
  function obtenerParalelo (id_paralelo) {
    return new Promise((resolve, reject) => {
      ParaleloModel.obtenerParalelo(id_paralelo, (err, paralelo) => {
        if (err) return reject(new Error('Error al obtener el paralelo'))
        delete paralelo.updatedAt
        delete paralelo.createdAt

        paralelo.peers = []
        return resolve(paralelo)
      })
    })
  }

  function obtenerGrupo(id_grupo) {
    return new Promise((resolve, reject) => {
      GrupoModel.obtenerGrupo(id_grupo, (err, grupo) => {
        if (err) return reject(new Error('Error al obtener el grupo'))
        return resolve(grupo)
      })
    })
  }

  co(function* () {
    var grupos = []
    var paralelo = yield obtenerParalelo(req.params.id_paralelo)
    for (var i = 0; i < paralelo.grupos.length; i++) {
      var grupo = yield obtenerGrupo(paralelo.grupos[i]._id)
      if (grupo) {
        grupos.push(grupo)
      }
    }
    paralelo.grupos = []
    paralelo.grupos = grupos
    respuesta.ok(res, paralelo)
  }).catch(fail => console.log(fail))
}

// TODO: Verificar que existe profesor y estudiante
const crearParalelo = (req, res) => {
  let paralelo = new ParaleloModel({
    nombre: req.body.nombre,
    limiteEstudiantes: req.body.limiteEstudiantes,
    horario: req.body.horario,
    diasClase: req.body.diasClase
  })
  paralelo.crearParalelo((err, doc) => {
	  if (err) return respuesta.serverError(res);
	  return respuesta.ok(res, paralelo)
  })
}

// TODO: devolver el dato actuzalidado
const actualizarParalelo = (req, res) => {
  let datos = {
    nombre: req.body.nombre,
    limiteEstudiantes: req.body.limiteEstudiantes
  }
  ParaleloModel.actualizarParalelo(req.params.id_paralelo, datos,(err, doc) => {
    if (!doc.nModified) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okActualizado(res);
  })
}

const eliminarParalelo = (req, res) => {
  ParaleloModel.eliminarParalelo(req.params.id_paralelo, (err,doc) => {
    if (!doc) return respuesta.mongoError(res, 'El paralelo no exite');
    if (err) return respuesta.serverError(res);
    return respuesta.okEliminado(res);
  })
}

/*
* Grupos
 */

// TODO: si ya existe este grupo en el paralelo
const anadirGrupoAParalelo = (req, res) => {
  ParaleloModel.anadirGrupoAParalelo(req.params.id_paralelo,req.params.id_grupo, (err, paralelo) => {
    if (err) return respuesta.serverError(res);
    return respuesta.okAnadido(res)
  })
}

// TODO: verificar si existe el paralelo y el grupo
const eliminarGrupoDeParalelo = (req, res) => {
  ParaleloModel.eliminarGrupoDeParalelo(req.params.id_paralelo, req.params.id_grupo, (err, doc) => {
    if (!doc) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okEliminado(res);
  })
}

/*
* Profesores
 */

// TODO: si ya hay profesor en paralelo
const anadirProfesorAParalelo = (req, res) => {
  ParaleloModel.anadirProfesorAParalelo(req.params.id_paralelo, req.params.id_profesor, (err, doc) => {
    if (!doc) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okAnadido(res);
  })
}

// TODO: si ya hay profesor, si el paralelo existe
const eliminarProfesorDeParalelo = (req, res) => {
  ParaleloModel.eliminarProfesorDeParalelo(req.params.id_paralelo, (err, doc) => {
    if (!doc) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okEliminado(res);
  })
}

const obtenerParalelosProfesor = (req, res) => {
	ParaleloModel.obtenerParalelosProfesor(req.session._id, (err, paralelos) => {
		if (err) return respuesta.serverError(res);
    if (paralelos.length == 0) {
      ParaleloModel.obtenerParaleloPeer(req.session._id, (err, paralelos) => {
        return respuesta.ok(res, paralelos)
      })
    } else {
      return respuesta.ok(res, paralelos)
    }
	})
}


const anadirPeerAParalelo = (req, res) => {
  const {id_paralelo, id_profesor} = req.params
  ParaleloModel.anadirPeerAParalelo(id_paralelo, id_profesor, (err, profe) => {
    if (err) return respuesta.serverError(res);
    return respuesta.okAnadido(res);
  })
}
/*
* Estudiantes
 */
// TODO: si el estudiante existe en otro paralelo
// TODO: si el paralelo existe, si el estudiante existe
const anadirEstudianteAParalelo = (req, res) => {
  ParaleloModel.anadirEstudianteAParalelo(req.params.id_paralelo, req.params.id_estudiante, (err, doc) => {
    if(!doc) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okAnadido(res);
  })
}

// TODO: si el estudiante no existe, si el paralelo no existe
const eliminarEstudianteDeParalelo = (req, res) => {
  ParaleloModel.eliminarEstudianteDeParalelo(req.params.id_paralelo, req.params.id_estudiante, (err, doc) => {
    if (!doc) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okEliminado(res);
  })
}

const obtenerParaleloDeEstudiante = (req, res) => {
  ParaleloModel.obtenerParaleloDeEstudiante(req.params.id_estudiante, (err, doc) => {
    if(err) return respuesta.serverError(res);
    return respuesta.ok(res, doc);
  })
}


/*
Lecciones
 */

// TODO: setea al curso que esta dando leccion
const dandoLeccion = (req, res) => {
	const { id_paralelo, id_leccion } = req.params
  var promises = []
	ParaleloModel.dandoLeccion(id_paralelo, id_leccion, (err, docs) => {
    if (err) return respuesta.serverError(res);
    return respuesta.okActualizado(res);
	})
}

const leccionYaComenzo = (req, res) => {
  ParaleloModel.empezoLeccion(req.params.id_paralelo, (err, dato) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res)
  })
}



module.exports = {
  obtenerTodosParalelos,
  crearParalelo,
  actualizarParalelo,
  eliminarParalelo,
  obtenerParalelo,
  // paralelos
  anadirGrupoAParalelo,
  eliminarGrupoDeParalelo,
  // profesor
  anadirProfesorAParalelo,
  eliminarProfesorDeParalelo,
  obtenerParalelosProfesor,
  anadirPeerAParalelo,
  // estudiante
  anadirEstudianteAParalelo,
  eliminarEstudianteDeParalelo,
  obtenerParaleloDeEstudiante,
	// lecciones
  leccionYaComenzo,
  dandoLeccion,
  obtenerParaleloParaLeccion
}
