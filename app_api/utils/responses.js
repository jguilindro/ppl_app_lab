function malRequest(res) {
  return res.status(400).json({
    estado: false,
    error_codigo: 400,
    error_mensaje: "Request mal enviado"
  })
}

function noAutorizado (res) {
  return res.status(401).json({
    estado: false,
    error_codigo: 401,
    error_mensaje: "No autorizado"
  })
}

function soloAdministrador (res) {
  return res.status(401).json({
    estado: false,
    error_codigo: 403,
    error_mensaje: "Solo para administadores"
  })
}

function urlNoValido (res) {
  return res.status(404).json({
    estado: false,
    error_codigo: 404,
    error_mensaje: "Url o metodo no valido"
  })
}

function urlMetodoInvalido (res) {
  return res.status(405).json({
    estado: false,
    error_codigo: 405,
    error_mensaje: "Url invalida"
  })
}

function noJson (res) {
  res.status(406).json({
    estado: false,
    error_codigo: 406,
    error_mensaje: "No es un json"
  })
}

function serverError (res) {
  return res.status(500).json({
    estado: false,
    error_codigo: 500,
    errorMensaje: "Servidor error"
  })
}
function servicioNoDisponible (res) {
  res.status(503).json({
    estado: false,
    error_codigo: 503,
    error_mensaje: "Servicio no capacitado"
  })
}

function mongoError (res, error) {
  res.status(500).json({
    estado: false,
    error_codigo: 503,
    error_mensaje: error
  })
}

function noOK (res) {
  return res.status(200).json({estado: false});
}

function noOKMensaje (res, datos) {
  return res.status(200).json({estado: false, datos: datos});
}

function ok (res, datos) {
  return res.status(200).json({estado: true, datos: datos});
}

function okEliminado (res) {
  return res.status(200).json({estado: true});
}

function okAnadido (res) {
  return res.status(200).json({estado: true});
}

function okActualizado (res) {
  return res.status(200).json({estado: true});
}

function okMensaje (res, datos) {
  return res.status(200).json({estado: true, datos: datos});
}

function creado (res, datos) {
  return res.status(201).json({estado: true, datos: datos});
}

module.exports = {
    malRequest,
    noAutorizado,
    soloAdministrador,
    urlNoValido,
    urlMetodoInvalido,
    noJson,
    serverError,
    servicioNoDisponible,
    mongoError,
    okEliminado,
    okAnadido,
    okActualizado,
    // validos
    ok,
    creado,
    noOKMensaje,
    // no validos
    noOK
  }
