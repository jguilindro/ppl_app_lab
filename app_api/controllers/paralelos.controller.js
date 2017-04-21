const ParaleloModel = require('../models/paralelo.model');
const GrupoLeccionModel = require('../models/grupoLeccion.model')
var respuesta = require('../utils/responses');
const utils = require('../utils')

const obtenerTodosParalelos = (req, res) => {
  ParaleloModel.obtenerTodosParalelos((err,paralelos) => {
    if(err) return respuesta.serverError(res);
    return respuesta.ok(res, paralelos);
  })
}

// TODO: si el paralelo no existe
const obtenerParalelo = (req, res) => {
  console.log('obtener paralelo');
  ParaleloModel.obtenerParalelo(req.params.id_paralelo, (err, paralelo) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, paralelo)
  })
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
		return respuesta.ok(res, paralelos)
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


/*
Lecciones
 */

// TODO: crear en todos los grupos la leccion y con datos iniciales
const dandoLeccion = (req, res) => {
	const { id_paralelo, id_leccion } = req.params
  var promises = []
	ParaleloModel.dandoLeccion(id_paralelo, id_leccion, (err, docs) => {
    if (err) return respuesta.serverError(res);
    ParaleloModel.obtenerParalelo(id_paralelo, (err, paralelo) => {
      if (err) return respuesta.serverError(res);
  		paralelo.grupos.forEach(grupo => {
        promises.push(new Promise((resolve, reject) => {
          let grupoLeccion = new GrupoLeccionModel({
            grupo: grupo._id,
            leccion: id_leccion,
            paralelo: id_paralelo,
            fechaEmpezado: utils.timezone()
          })
          grupoLeccion.crearGrupoLeccion((err, doc) => {
            if (err) return reject(err);
            resolve(true)
          })
        }))
      })
      Promise.all(promises).then(values => console.log(`los GRUPOLECCION fueron creados`))
        .catch(fail => console.log(fail))
  		return respuesta.okActualizado(res);
    })
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
  // estudiante
  anadirEstudianteAParalelo,
  eliminarEstudianteDeParalelo,
	// lecciones
	dandoLeccion,
}
