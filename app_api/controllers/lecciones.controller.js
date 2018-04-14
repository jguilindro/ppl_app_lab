const LeccionModel      = require('../models/leccion.model');
const ParaleloModel     = require('../models/paralelo.model');
const GrupoModel        = require('../models/grupo.model');
const EstudianteModel   = require('../models/estudiante.model');
const CalificacionModel = require('../models/calificacion.model');
const PreguntaModel     = require('../models/pregunta.model');
const RespuestaModel    = require('../models/respuestas.model');
var respuesta           = require('../utils/responses');
var co                  = require('co')
const _ = require('lodash')
// armarArrayPreguntas: function(preguntasObtenidas, respuestasObtenidas, estudianteId){
//       var self = this;
//       let arrayPreguntas = [];
//       for( let i = 0; i < preguntasObtenidas.length; i++ ) {
//         let preguntaActual               = preguntasObtenidas[i].pregunta;
//         let respuestaActual              = $.grep(respuestasObtenidas, function(respuesta, i){
//           return preguntaActual._id == respuesta.pregunta;
//         })[0];
//         preguntaActual.orden             = preguntasObtenidas[i].ordenPregunta;
//         preguntaActual.subpreguntas      = App.armarArraySubpreguntas(preguntaActual, respuestaActual, estudianteId);
//         preguntaActual.tieneSubpreguntas = ( preguntaActual.subpreguntas != null && preguntaActual.subpreguntas.length > 0 );
//         arrayPreguntas.push(preguntaActual);
//       }
//       return arrayPreguntas;
//     },
//     armarArraySubpreguntas: function(pregunta, respuesta, estudianteId){
//       var self = this;
//       let array = [];
//       for (var i = 0; i < pregunta.subpreguntas.length; i++) {
//         let subActual    = pregunta.subpreguntas[i];
//         let subResActual = $.grep(respuesta.subrespuestas, function(res, i){
//           return subActual.orden == res.ordenPregunta;
//         })[0];

//         subActual.pregunta     = pregunta._id;
//         subActual.respuesta    = subResActual.respuesta;
//         subActual.estudiante   = estudianteId;
//         subActual.calificacion = subResActual.calificacion;
//         subActual.feedback     = subResActual.feedback;
//         subActual.calificada   = subResActual.calificada;
//         if(subResActual.imagen.indexOf('imgur') > 0){
//           subActual.imagen     = subResActual.imagen; 
//         }else{
//           subActual.imagen     = '';
//         }
 
//         let calPonderada          = App.ponderarCalificacion(2, subActual.calificacion, subActual.puntaje);
//         App.calificacionTotal     = App.calificacionTotal + calPonderada;
//         App.calificacionPonderada = App.ponderarCalificacion(App.leccion.puntaje, App.calificacionTotal, 100).toFixed(2);

//         array.push(subActual);
//         /*Crea arreglos de subrespuestas para todos los estudiantes*/
//         self.subrespuestasEstudiantes.push(subActual);
//         /* Si el estudiante al que se le crean las subpreguntas es el mismo que está conectado
//          * guarda sus respuestas en un arreglo aparte
//          */
//         if (self.estudianteId== estudianteId){
//           self.subrespuestasConectado.push(subActual);
//         }
        
//       }
//       return array;
//     }
const detalleLeccion = async function (req, res) {
  const { leccionId } = req.params
  const estudianteId = req.session._id
  // Obtener el grupo del estudiante //Obtiene los ids de todos los estudiantes del grupo // nombreDeLosEstudiantes
  obtenerGrupo = (estudianteId) => {
    return new Promise((resolve, reject) => {
      GrupoModel.obtenerGruposDeEstudiantePopulate(estudianteId, (err, doc) => {
        if(err) return reject(err)
        resolve(doc)
      })
    })
  }

  function buscarEstudiante(id_estudiante) {
    return new Promise((resolve, reject) => {
      EstudianteModel.obtenerEstudianteNoPopulate(id_estudiante, (err, est) => {
        if (err) return reject(new Error('No se pudo obtener estudiante'));
        return resolve(est);
      })
    })
  }
  // obtengo la leccion con las preguntas
  function obtenerLeccion(id_leccion) {
    return new Promise((resolve, reject) => {
      LeccionModel.obtenerLeccionPopulate(id_leccion, (err, leccion) => {
        if (err) return reject(new Error('No se puedo obtener Leccion'));
        return resolve(leccion);
      })
    })
  }
  //Obtengo las respuestas que ya ha enviado el estudiante
  function obtenerRespuestas(grupoId) {
    return new Promise((resolve, reject) => {
      RespuestaModel.obtenerRespuestaPorGrupo(grupoId, leccionId, (err ,respues) => {
        if (err) return reject(new Error('No se puedo obtener Respuesta estudiante'))
        return resolve(respues)
      });
    });
  }

  let grupo = await obtenerGrupo(estudianteId)
  let estudiante  = await buscarEstudiante(estudianteId)
  let leccion  = await obtenerLeccion(leccionId)
  let grupoId = grupo['_id']
  // let respuestasPorPregunta = preguntas.reduce((result, pregunta, index) => {
  //   result = {
  //     id: pregunta._id,

  //   }
  //   return result
  // }, { })
  var respuestas = await obtenerRespuestas(grupoId, leccionId)
  let preguntasArmadas = await armarArrayPreguntas(leccion.preguntas, respuestas)
  let preguntas = leccion['preguntas']
  let preguntasLimpiada = _.sortBy(preguntas, o => o.ordenP).map((pregunta) => {
      let preguntaId = pregunta.pregunta['_id']
      let respuestasPregunta = _.filter(respuestas, function(o) { return o.pregunta === preguntaId })
      let respuestasFiltradas = respuestasPregunta.map((respuesta) => {
        return _.pick(respuesta, ['feedback', 'imagenes', 'respuesta', 'calificacion', 'estudiante']) 
      })
      let preguntasFiltradas = _.pick(pregunta.pregunta, ['descripcion', 'nombre', 'puntaje'])
      preguntasFiltradas['respuestas'] = respuestasFiltradas
      return preguntasFiltradas
    })
  let leccionDatos = {
    nombre: leccion['nombre'],
    fechaTomada: leccion['fechaInicioTomada'],
    preguntas: preguntasLimpiada
  }
  return respuesta.ok(res, {estudiante: estudiante, preguntasArmadas, leccionTmp: leccion, respuestas, preguntas, grupo, leccion: leccionDatos})
}

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

/*
  @Autor: @edisonmora95
  @Ruta: "/api/lecciones/:id_leccion/estadisticas"
  @Descripción: Devuelve las calificaciones de todos los grupos de una lección indicada
  @Respuesta:
    {
      grupos        : [],   //Array de nombre de grupos
      calificaciones: [],   //Array de calificaciones de cada grupo
      leccion       : {},   //JSON de la lección seleccionada
      max           : {},   //Calificación máxima y el nombre del grupo que la obtuvo
      min           : {},   //Calificación mínima y el nombre del grupo que la obtuvo
      prom          : Float //Promedio de las calificaciones
    }
*/
const estadisticasGeneral = (req, res) => {
  function obtenerCalificacionesDeLeccion(id_leccion){
    return new Promise((resolve, reject) => {
      CalificacionModel.obtenerRegistroPorLeccion(id_leccion, (err, docs) => {
        if (err) return reject(new Error('No se pudieron obtener las calificaciones'));
        return resolve(docs);
      });
    });
  }
  function obtenerLeccion(id_leccion) {
    return new Promise((resolve, reject) => {
      LeccionModel.obtenerLeccionPopulate(id_leccion, (err, leccion) => {
        if (err) return reject(new Error('No se puedo obtener Leccion'));
        return resolve(leccion);
      });
    });
  }
  function armarDiccionarioCalificaciones(arrayCal){
    let diccionario = {};
    for (let i = 0; i < arrayCal.length; i++) {
      if( arrayCal[i].grupo != null ){
        let grupo          = arrayCal[i].grupo.nombre;
        let calificacion   = arrayCal[i].calificacion;
        diccionario[grupo] = calificacion;  
      }
    }
    return diccionario
  }
  function getMax(diccionario){
    let max = {
      grupo : '',
      calificacion : 0.00
    };
    for (var grupo in diccionario) {
      if (diccionario.hasOwnProperty(grupo)) {
        if ( diccionario[grupo] > max.calificacion ) {
          max.grupo        = grupo;
          max.calificacion = diccionario[grupo];
        }
      }
    }
    return max;
  }
  function getMin(diccionario){
    let min = {
      grupo : '',
      calificacion : 100.00
    };
    for (var grupo in diccionario) {
      if (diccionario.hasOwnProperty(grupo)) {
        if ( diccionario[grupo] < min.calificacion ) {
          min.grupo        = grupo;
          min.calificacion = diccionario[grupo];
        }
      }
    }
    return min;
  }
  function getProm(diccionario){
    let contador = 0;
    let promedio = 0.00;
    for (var grupo in diccionario) {
      if (diccionario.hasOwnProperty(grupo)) {
        promedio += diccionario[grupo];
        contador++;
      }
    }
    promedio = promedio/contador;
    return promedio.toFixed(2);
  }

  const id_leccion = req.params.id_leccion;
  let arrayGrupos  = [];
  let arrayCal     = [];
  let leccion      = {};

  co(function *(){
    leccion            = yield obtenerLeccion(id_leccion);
    let calificaciones = yield obtenerCalificacionesDeLeccion(id_leccion);
    calificaciones.sort(customSort);
    for (let i = 0; i < calificaciones.length; i++) {
      let actual = calificaciones[i];
      arrayGrupos.push(actual.nombreGrupo);
      arrayCal.push(actual.calificacion);
    }
    let diccionario = armarDiccionarioCalificaciones(calificaciones);
    let max = getMax(diccionario);
    let min = getMin(diccionario);
    let prom= getProm(diccionario);
    return respuesta.ok(res, {grupos : arrayGrupos, calificaciones : arrayCal, leccion : leccion, max : max, min : min, prom : prom});
  }).catch( fail => {
    return respuesta.serverError(res);
  })
}

/*
  @Autor: @edisonmora95
  @Ruta : "/api/lecciones/:id_leccion/estadisticas/preguntas"
  @Descripción : Devuelve la cantidad de 0s, 1s, y 2s que se tuvieron por cada pregunta de la lección indicada
  @Respuesta:
    {
      labels  : [],  //Array con los nombres de las preguntas y secciones
      cal0    : [],  //Array de cantidad de 0's que se tuvieron por cada pregunta de la lección
      cal1    : [],  //Array de cantidad de 1's que se tuvieron por cada pregunta de la lección
      cal2    : [],  //Array de cantidad de 2's que se tuvieron por cada pregunta de la lección
      nGrupos : int  //Número de grupos que dieron la lección
    }
*/
const estadisticasPreguntas = (req, res) => {
  function obtenerLeccion(id_leccion) {
    return new Promise((resolve, reject) => {
      LeccionModel.obtenerLeccion(id_leccion, (err, leccion) => {
        if (err) return reject(new Error('No se puedo obtener Leccion'));
        return resolve(leccion);
      });
    });
  }

  function obtenerRespuestasCalificadas(id_leccion, array_estudiantes) {
    return new Promise( (resolve, reject) => {
      RespuestaModel.obtenerRespuestasCalificadas(id_leccion, array_estudiantes, (err, docs) => {
        if (err) return reject( new Error("No se pudo realizar el query"))
        return resolve(docs);
      });
    });
  }

  function obtenerRegistroCalificaciones(id_leccion){
    return new Promise( (resolve, reject) => {
      CalificacionModel.obtenerRegistroPorLeccion(id_leccion, (err, registros) => {
        if (err) return reject("Error en el query de calificaciones")
        return resolve(registros)
      });
    });
  }

  function obtenerPregunta(id_pregunta) {
    return new Promise((resolve, reject) => {
      PreguntaModel.obtenerPregunta(id_pregunta, (err, pregutna) => {
        if (err) return reject(new Error('No se puedo obtener la pregunta'));
        return resolve(pregutna);
      });
    });
  }

  function obtenerParaleloPorId(id_paralelo){
    return new Promise((resolve, reject) => {
      ParaleloModel.obtenerParalelo(id_paralelo, (err, doc) =>{
        if (err) return reject(err);
        return resolve(doc);
      });
    });
  }

  function encerarValoresNoEncontrados(cal0, cal1, cal2, i){
    if ( isNaN(cal0[i]) ) {
      cal0[i] = 0;
    }
    if ( isNaN(cal1[i]) ) {
      cal1[i] = 0;
    }
    if ( isNaN(cal2[i]) ) {
      cal2[i] = 0;
    }
  }

  function aumentarContadorCalificaciones(cal0, cal1, cal2, i, calificacion){
    if ( calificacion === 0) {
      cal0[i]++;  
    } else if ( calificacion === 1) {
      cal1[i]++;  
    } else if ( calificacion === 2) {
      cal2[i]++;  
    }
  }

  const id_leccion = req.params.id_leccion;
  co( function *(){
    let contador_subpreguntas = 0;
    let cal0   = [];
    let cal1   = [];
    let cal2   = [];
    let labels = [];
    const leccion                = yield obtenerLeccion(id_leccion);
    const registros_calificacion = yield obtenerRegistroCalificaciones(id_leccion);
    const paralelo               = yield obtenerParaleloPorId(leccion.paralelo);
    const nGrupos = paralelo.grupos.length;
    //Obtengo el array de estudiantes calificados
    let array_estudiantes = [];
    for (let i = 0; i < registros_calificacion.length; i++) {
      array_estudiantes.push(registros_calificacion[i].estudianteCalificado);
    }
    //Obtengo las respuestas de todas las preguntas de los estudiantes calificados
    let array_respuestas = yield obtenerRespuestasCalificadas(id_leccion, array_estudiantes);
    //Recorro todas las preguntas de la lección
    for (let i = 0; i < leccion.preguntas.length; i++) {
      let id_pregunta = leccion.preguntas[i].pregunta;
      let pregunta    = yield obtenerPregunta(id_pregunta);
      let num_subpreguntas = pregunta.subpreguntas.length;
      //Armo el label de la pregunta actual
      let label       = "";
      if ( leccion.tipo === "estimacion|laboratorio" ) {
        label = "Pregunta-" + (i+1);
        labels[i] = label;
      } else {
        for (let m = 0; m < num_subpreguntas; m++) {
          label = "Sección-" + (i+1) + " P" + (m+1);
          labels.push(label);  
        }
      }
      //Obtengo todas las respuestas de la pregunta actual
      let res_pregunta = array_respuestas.filter( (actual) => {
        return actual.pregunta === id_pregunta;
      });
      //Recorro todas las respuestas de la pregunta actual
      for (let j = 0; j < res_pregunta.length; j++) {
        let respuesta_actual = res_pregunta[j];
        if ( leccion.tipo === "estimacion|laboratorio" ) {
          let calificacion = respuesta_actual.calificacion;
          encerarValoresNoEncontrados(cal0, cal1, cal2, i);
          aumentarContadorCalificaciones(cal0, cal1, cal2, i, calificacion);
        } else {
          for ( let k = 0; k < respuesta_actual.subrespuestas.length; k++) {
            let calificacion = respuesta_actual.subrespuestas[k].calificacion;
            encerarValoresNoEncontrados(cal0, cal1, cal2, (k+contador_subpreguntas));
            aumentarContadorCalificaciones(cal0, cal1, cal2, (k+contador_subpreguntas), calificacion);
          }
        }
      }
      contador_subpreguntas = contador_subpreguntas + num_subpreguntas;
    }
    return respuesta.ok(res, { labels : labels, cal0 : cal0, cal1 : cal1, cal2 : cal2, nGrupos : nGrupos});
  })
  .catch( error => {
    return respuesta.serverError(res);
  });
}

module.exports = {
  crearLeccion,
  obtenerTodasLecciones,
  obtenerLeccion,
  actualizarLeccion,
  eliminarLeccion,
  leccionYaCalificada,
  obtenerLeccionRecalificar,
  leccionDatos,
  estadisticasGeneral,
  estadisticasPreguntas,
  // realtime
  tomarLeccion,
  anadirTiempo,
  comenzarLeccion,
  habilitarEstudiantesCursoParaLeccion,
  obtenerLeccionesParalelo,
  terminarLeccion,
  detalleLeccion
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

function customSort(a, b) {
  return (Number(a.nombreGrupo.match(/(\d+)/g)[0]) - Number((b.nombreGrupo.match(/(\d+)/g)[0])));
}
