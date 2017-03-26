const GrupoModel = require('../models/grupo.model')
var respuesta = require('../utils/responses');

// TODO: filtros paralelo, nombre
const obtenerTodosGrupos = (req, res) => {
  GrupoModel.obtenerTodosGrupos((err, grupos) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, grupos);
  })
}

// FIXME: que no se repita el nombre grupo en el mismo paralelo
const crearGrupo = (req, res) => {
  let grupo = new GrupoModel({
    nombre: req.body.nombre,
    paralelo: req.body.idParalelo
  })
  grupo.crearGrupo((err) => {
    if (err.code === 11000) return respuesta.mongoError(res, 'Ya existe');
    if (err) return respuesta.serverError(res);
    return respuesta.creado(res, grupo);
  })
}

const obtenerGrupo = (req, res) => {
  GrupoModel.obtenerGrupo(req.params.id_grupo, (err, grupo) => {
    if (err.code == 11000) return respuesta.mongoError(res, 'Ya existe');
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, grupo);
  })
}

// TODO: editar solo nombre
const editarGrupo = (req, res) => {
  res.send('editarGrupo');
}

// FIXME: eliminar por Paralelo al que pertenece
const eliminarGrupo = (req, res) => {
  GrupoModel.eliminarGrupo(req.params.id_grupo, (err, doc, result) => {
    if (!doc) return respuesta.mongoError(res, 'No existe este grupo')
    if (err) return respuesta.serverError(res);
    return respuesta.okEliminado(res);
  })
}

module.exports = {
  obtenerTodosGrupos,
  crearGrupo,
  editarGrupo,
  eliminarGrupo,
  obtenerGrupo,
}
