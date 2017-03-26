const PreguntaModel = require('../models/pregunta.model');
var respuesta = require('../utils/responses');

const obtenerTodasPreguntas = (req, res) => {
  PreguntaModel.obtenerTodasPreguntas((err, preguntas) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, preguntas);
  })
}

const obtenerPregunta = (req, res) => {
  PreguntaModel.obtenerPregunta(req.params.id_pregunta,(err, pregunta) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, pregunta);
  })
}

const obtenerPreguntasPorCreador = (req, res) => {
  const {id_creador} = req.params
  PreguntaModel.obtenerPreguntasPorCreador(id_creador, (err, preguntas) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, preguntas);
  })
}

const crearPregunta = (req, res) => {
  // con quien este loggeado anadir el id creador
  let pregunta = new PreguntaModel({
    tipo: req.body.tipo,
    capitulo: req.body.capitulo,
    tiempoEstimado: req.body.tiempoEstimado,
    puntaje: req.body.puntaje
  })
  pregunta.crearPregunta((err, doc) => {
    if (err) return respuesta.serverError(res);
    return respuesta.creado(res, pregunta);
  })
}

const actualizarPregunta = (req, res) => {
  let actualizar = {
    tipo: req.body.tipo,
    capitulo: req.body.capitulo,
    tiempoEstimado: req.body.tiempoEstimado,
    puntaje: req.body.puntaje
  }
  PreguntaModel.actualizarPregunta(req.params.id_pregunta, actualizar, (err, doc) => {
    if (!doc.nModified) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okActualizado(res);
  })
}

const eliminarPregunta = (req, res) => {
  const {id_pregunta} = req.params;
  PreguntaModel.eliminarPregunta(id_pregunta, (err, doc) => {
    if (!doc) return respuesta.mongoError(res, 'El paralelo no exite');
    if (err) return respuesta.serverError(res);
    return respuesta.okEliminado(res);
  })
}

module.exports = {
  obtenerTodasPreguntas,
  obtenerPregunta,
  obtenerPreguntasPorCreador,
  crearPregunta,
  actualizarPregunta,
  eliminarPregunta,
}
