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
  PreguntaModel.obtenerPreguntasPorCreador(req.params.id_profesor, (err, preguntas) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, preguntas);
  })
}


const crearPregunta = (req, res) => {
  let pregunta = new PreguntaModel({
    creador: req.body.creador,
    nombre: req.body.nombre,
    tipoLeccion: req.body.tipoLeccion,
    tipoPregunta: req.body.tipoPregunta,
    capitulo: req.body.capitulo,
    tutorial: req.body.tutorial,
    laboratorio: req.body.laboratorio,
    tiempoEstimado: req.body.tiempoEstimado,
    puntaje: req.body.puntaje,
    descripcion: req.body.descripcion,
    subpreguntas: req.body.subpreguntas,
  })
  pregunta.crearPregunta((err, pregunta) => {
    if (err) return respuesta.serverError(res);
    return respuesta.creado(res);
  })
}

const actualizarPregunta = (req, res) => {
  let actualizar = {
    nombre: req.body.nombre,
    tipoLeccion: req.body.tipoLeccion,
    tipoPregunta: req.body.tipoPregunta,
    capitulo: req.body.capitulo,
    laboratorio: req.body.laboratorio,
    tutorial: req.body.tutorial,
    tiempoEstimado: req.body.tiempoEstimado,
    puntaje: req.body.puntaje,
    descripcion: req.body.descripcion,
    subpreguntas: req.body.subpreguntas
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
