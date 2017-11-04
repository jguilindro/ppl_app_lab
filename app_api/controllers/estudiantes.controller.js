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
  // Obtiene los datos del estudiante
  function buscarEstudiante(id_estudiante) {
    return new Promise((resolve, reject) => {
      EstudianteModel.obtenerEstudianteNoPopulate(id_estudiante, (err, est) => {
        if (err) return reject(new Error('No se pudo obtener estudiante'));
        return resolve(est);
      });
    });
  }
  // obtengo el grupo del estudiante
  function buscarGrupo(id_estudiante) {
    return new Promise((resolve, reject) => {
      GrupoModel.obtenerGrupoDeEstudiante(id_estudiante, (err, grupo) => {
        if (err) return reject(new Error('No se pudo obtener grupo estudiante'));
        return resolve(grupo);
      });
    });
  }
  // obtener el pralelo del estudiante
  function buscarParalelo(id_estudiante) {
    return new Promise((resolve, reject) => {
      ParaleloModel.obtenerParaleloDeEstudiante(id_estudiante, (err, paralelo) => {
        if (err) return reject(new Error('No se puedo obtener grupo estudiante'));
        return resolve(paralelo);
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
  //Añade al estudiante al registro de calificaciones
  function anadirParticipanteARegistro(id_leccion,id_grupo, id_estudiante) {
    return new Promise((resolve, reject) => {
      CalificacionModel.anadirParticipante(id_leccion,id_grupo, id_estudiante, (err, doc) => {
    		if(err) return reject(new Error('Error al anadir participante'));
    		return resolve(true);
    	});
    });
  }
  //Indica a la base que el estudiante está tomando una lección en este momento
  function anadirLeccionYaComenzo(id_estudiante) {
    return new Promise((resolve, reject) => {
      EstudianteModel.anadirLeccionYaComenzo(id_estudiante, (err, res) => {
        if (err) return reject(new Error('Erro al anadir leccion ya comenzo'));
        if (res) return resolve(true);
        return resolve(false);
      });
    });
  }

  co(function* () {
    const id_estudiante  = req.session._id;
    let leccionYaComenzo = anadirLeccionYaComenzo(id_estudiante);
    let estudiante       = yield buscarEstudiante(id_estudiante);
    let grupo            = yield buscarGrupo(id_estudiante);
    let paralelo         = yield buscarParalelo(id_estudiante);
    let leccion          = yield obtenerLeccion(estudiante.leccion);
    let respuestas       = yield obtenerRespuestas(estudiante.leccion, id_estudiante);
    let anadido          = yield anadirParticipanteARegistro(estudiante.leccion, grupo._id, id_estudiante);

    let preguntas        = armarArrayPreguntas(leccion.preguntas, respuestas);
    respuesta.ok(res, {estudiante: estudiante, grupo: grupo, paralelo: paralelo, leccion: leccion, respuestas: respuestas, anadidoARegisto: anadido, preguntas: preguntas})
  });

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

////////////////////////////////////////////
//FUNCIONES
////////////////////////////////////////////
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
    //Si la pregunta es una sección se añaden sus subpreguntas y subrespuestas
    actualP.esSeccion = ( actualP.subpreguntas != null && actualP.subpreguntas.length > 0 );
    if( actualP.esSeccion ){
      actualP.subpreguntas = armarArraySubpreguntas(actualP, actualR);
      actualP.terminada    = verificarSeccionTerminada(actualP);
      actualP.respondida   = verificarSeccionRespondida(actualP);
    }else{
      asignarRespuestaP(actualP, actualR);
      actualP.terminada = '';
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
  }else{
    pregunta.respuesta  = respuesta.respuesta;  
    pregunta.imagen     = respuesta.imagen;
    pregunta.respondida = true;
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
  }else{
    pregunta.respuesta  = respuesta.respuesta;  
    pregunta.imagenes   = respuesta.imagenes;
    pregunta.respondida = true;
  }
}