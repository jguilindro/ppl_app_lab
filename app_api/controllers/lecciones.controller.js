const LeccionModel = require('../models/leccion.model');
const ParaleloModel = require('../models/paralelo.model');
const GrupoModel = require('../models/grupo.model');
const EstudianteModel = require('../models/estudiante.model');
const CalificacionModel = require('../models/calificacion.model');
const PreguntaModel = require('../models/pregunta.model');
const RespuestaModel = require('../models/respuestas.model');
var respuesta = require('../utils/responses');
var co = require('co')

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

const obtenerLeccionRecalificar = (req, res) => {
  const { id_leccion } = req.params
  LeccionModel.obtenerLeccionPopulate(id_leccion, (err, leccion) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res,leccion);
  });
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
  var anadirPregunta = function(id_pregunta, id_leccion) {
    return new Promise((resolve, reject) => {
      PreguntaModel.anadirUsadaEnLeccion(id_pregunta, id_leccion, (err, res ) => {
        if (err) return reject(err)
        return resolve(true)
      })
    })
  }

  function obtenerParaleloPorId(id_paralelo){
    return new Promise((resolve, reject) => {
      ParaleloModel.obtenerParalelo(id_paralelo, (err, doc) =>{
        if (err) return reject(err);
        return resolve(doc);
      });
    });
  }

  function crearLeccionP(leccion){
    return new Promise((resolve, reject) => {
      leccion.crearLeccion((err, doc) => {
        if (err) return reject(err);
        return resolve(leccion);
      });
    });
  }

  function crearRegistroCalificacion(registro){
    return new Promise((resolve, reject) => {
      registro.crearRegistro((err, doc) => {
        if (err) return reject(err);
        return resolve(doc);
      });
    }); 
  }

  let leccion = new LeccionModel({
    creador       : req.session._id,
    nombre        : req.body.nombre,
    tiempoEstimado: req.body.tiempoEstimado,
    puntaje       : parseInt(req.body.puntaje),
    tipo          : req.body.tipo,
    fechaInicio   : req.body.fechaInicio,
    preguntas     : req.body.preguntas,
    paralelo      : req.body.paralelo,
    nombreParalelo: req.body.nombreParalelo,
    nombreMateria : req.body.nombreMateria,
    codigoMateria : req.body.codigoMateria
  });

  co(function*() {
    //Primero registro las preguntas que se han usado en esta lección
    for (var i = 0; i < leccion.preguntas.length; i++) {
      var c = yield anadirPregunta(leccion.preguntas[i].pregunta, leccion._id)
    }
    //Creo la lección
    let leccionCreada = yield crearLeccionP(leccion);
    let paralelo      = yield obtenerParaleloPorId(req.body.paralelo);
    let grupos        = paralelo.grupos;
    //Creo los registros en Calificaciones
    for (var j = 0; j < grupos.length; j++) {
      let grupoActual = grupos[j];
      let registro = new CalificacionModel({
        leccion       : leccionCreada._id,
        calificacion  : 0,
        calificada    : false,
        leccionTomada : false,
        grupo         : grupoActual._id,
        nombreGrupo   : grupoActual.nombre,
        paralelo      : leccionCreada.paralelo,
        nombreParalelo: paralelo.nombre
      });
      console.log('registro:', registro)
      yield crearRegistroCalificacion(registro);
    }
    return respuesta.creado(res, leccionCreada);
  }).catch( fail => {
    return respuesta.serverError(res);
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

const leccionYaCalificada = (req, res) => {
  LeccionModel.obtenerLeccion(req.params.id_leccion, (err, leccion) => {
    if (err) return respuesta.serverError(res);
    if (leccion.estado == 'pendiente' || leccion.estado == 'tomando' || leccion.estado == 'terminado') {
      return respuesta.ok(res, false);
    }
    CalificacionModel.obtenerRegistroPorLeccion(req.params.id_leccion, (err, calificaciones) => {
      if (err) return respuesta.serverError(res);
      for (var i = 0; i < calificaciones.length; i++) {
        if (!calificaciones[i].calificada && calificaciones[i].participantes.length != 0) {
          return respuesta.ok(res, false);
          break;
        }
      }
      return respuesta.ok(res, true);
    })
  })
}

const terminarLeccion = (req, res, next) => {
  ParaleloModel.obtenerParalelosProfesor(req.session._id, function(err, paralelo) {
    ParaleloModel.leccionTerminada(paralelo._id, (err, para) => {
      if (err) return respuesta.serverError(res);
      return respuesta.ok(res, true)
    })
  })
}

const leccionDatos = (req, res) => {
  // Obtiene los datos del estudiante
  function buscarEstudiante(id_estudiante) {
    return new Promise((resolve, reject) => {
      EstudianteModel.obtenerEstudianteNoPopulate(id_estudiante, (err, est) => {
        if (err) return reject(new Error('No se pudo obtener estudiante'));
        return resolve(est);
      });
    });
  }
  // obtengo la leccion con las preguntas
  function obtenerLeccion(id_leccion) {
    return new Promise((resolve, reject) => {
      LeccionModel.obtenerLeccionPopulate(id_leccion, (err, leccion) => {
        if (err) return reject(new Error('No se puedo obtener Leccion'));
        return resolve(leccion);
      });
    });
  }
  //Obtengo las respuestas que ya ha enviado el estudiante
  function obtenerRespuestas(id_leccion, id_estudiante) {
    return new Promise((resolve, reject) => {
      RespuestaModel.obtenerRespuestasDeEstudiante(id_leccion, id_estudiante, (err ,respues) => {
        if (err) return reject(new Error('No se puedo obtener Respuesta estudiante'));
        return resolve(respues);
      });
    });
  }

  co(function* () {
    const id_estudiante  = req.params.id_estudiante;
    const id_leccion     = req.params.id_leccion;
    let estudiante       = yield buscarEstudiante(id_estudiante);
    let leccion          = yield obtenerLeccion(id_leccion);
    let respuestas       = yield obtenerRespuestas(id_leccion, id_estudiante);
    let preguntas        = yield armarArrayPreguntas(leccion.preguntas, respuestas);

    respuesta.ok(res, {estudiante: estudiante, leccion: leccion, respuestas: respuestas, preguntas : preguntas})
  });
};

module.exports = {
  crearLeccion,
  obtenerTodasLecciones,
  obtenerLeccion,
  actualizarLeccion,
  eliminarLeccion,
  leccionYaCalificada,
  obtenerLeccionRecalificar,
  leccionDatos,
  // realtime
  tomarLeccion,
  anadirTiempo,
  comenzarLeccion,
  habilitarEstudiantesCursoParaLeccion,
  obtenerLeccionesParalelo,
  terminarLeccion
}


/*
  Arma un array con las preguntas de la lección junto con las respuestas que el estudiante pudo haber enviado previamente
  @Params:
    arrayP: array de preguntas de la lección que se está tomando
    arrayR: array de respuestas del estudiante.
*/
function armarArrayPreguntas(arrayP, arrayR){
  let preguntas = [];
  for (let i = 0; i < arrayP.length; i++) {
    //Asigno la información de la pregunta y el orden que esta tiene en la lección actual
    let actualP    = armarPregunta(arrayP[i].pregunta);
    actualP.ordenP = arrayP[i].ordenPregunta;
    //Obtengo la respuesta del estudiante a esta pregunta actual. Por el id de la pregunta
    let actualR   = arrayR.find( respuesta => respuesta.pregunta == actualP._id );
    //console.log('idRespuesta', actualR._id)
    //Si la pregunta es una sección se añaden sus subpreguntas y subrespuestas
    actualP.esSeccion = ( actualP.subpreguntas != null && actualP.subpreguntas.length > 0 );
    if( actualP.esSeccion ){
      actualP.subpreguntas = armarArraySubpreguntas(actualP, actualR);
      actualP.respondida   = verificarSeccionRespondida(actualP);
    }else{
      asignarRespuestaP(actualP, actualR);
    }
    preguntas.push(actualP);
  }
  return preguntas;
}
/*
  Devuelve el objeto de Pregunta con los campos necesarios para la lección
*/
function armarPregunta(pregunta){
  let obj = {};
  obj._id            = pregunta._id;
  obj.descripcion    = pregunta.descripcion;
  obj.nombre         = pregunta.nombre;
  obj.puntaje        = pregunta.puntaje;
  obj.subpreguntas   = pregunta.subpreguntas;
  obj.tiempoEstimado = pregunta.tiempoEstimado;
  return obj;
}

/*
  Devuelve el array de las subpreguntas de la sección junto con las respuestas correspondientes que el estudiante pudo haber enviado previamente.
  @Params:
    pregunta:  JSON de la pregunta actual
    respuesta: JSON de la respuesta a la pregunta actual
*/
function armarArraySubpreguntas(pregunta, respuesta){
  let subpreguntas = [];
  for (var i = 0; i < pregunta.subpreguntas.length; i++) {
    //Asigno contenido, orden y puntaje
    let actualSP = pregunta.subpreguntas[i];
    let actualSR = null;
    //Si la pregunta actual si fue respondida por el estudiante asigno la subrespuesta a la subpregunta actual
    if( respuesta != null ){
      //Obtengo la respuesta correspondiente
      actualSR = respuesta.subrespuestas.find( sr => sr.ordenPregunta == actualSP.orden );
    }
    //Asigno la respuesta del estudiante y la imagen que subió
    asignarRespuesta(actualSP, actualSR);
    subpreguntas.push(actualSP);
  }
  return subpreguntas;
}

/*
  Asigno los datos necesarios de la respuesta del estudiante
  Esta función valida si el objeto enviado como respuesta es null
  Esto significa que el estudiante o no respondió a la pregunta o a la subpregunta
*/
function asignarRespuesta(pregunta, respuesta){
  if( respuesta == null ){
    pregunta.respuesta  = '';
    pregunta.imagen     = '';
    pregunta.respondida = false;
    pregunta.calificacion = 0;
    pregunta.feedback = '';
    pregunta.calificada = false;
  }else{
    pregunta.respuesta  = respuesta.respuesta;  
    pregunta.imagen     = respuesta.imagen;
    pregunta.respondida = true;
    pregunta.calificacion = respuesta.calificacion;
    pregunta.feedback = respuesta.feedback;
    pregunta.calificada = respuesta.calificada;
  }
}

function verificarSeccionTerminada(seccion){
  let flag = '';
  for (var i = 0; i < seccion.subpreguntas.length; i++) {
    let actualP = seccion.subpreguntas[i];
    if( !actualP.respondida ){
      flag = 'disabled';
      break;
    }
  }
  return flag;
}

function verificarSeccionRespondida(seccion){
  let flag = false;
  for (var i = 0; i < seccion.subpreguntas.length; i++) {
    let actualP = seccion.subpreguntas[i];
    if( actualP.respondida ){
      flag = true;
      break;
    }
  }
  return flag;
}

function asignarRespuestaP(pregunta, respuesta){
  if( respuesta == null ){
    pregunta.respuesta  = '';
    pregunta.imagenes   = '';
    pregunta.respondida = false;
    pregunta.calificacion = 0;
    pregunta.feedback = '';
    pregunta.calificada = false;
  }else{
    pregunta.respuesta  = respuesta.respuesta;  
    pregunta.imagenes   = respuesta.imagenes;
    pregunta.respondida = true;
    pregunta.calificacion = respuesta.calificacion;
    pregunta.feedback = respuesta.feedback;
    pregunta.calificada = respuesta.calificada;
  }
}



