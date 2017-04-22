function malRequest(res) {
  return res.status(400).json({
    estado: false,
    errorCodigo: 400,
    errorMensaje: "Request mal enviado"
  })
}

function noAutorizado (res) {
  return res.status(401).json({
    estado: false,
    errorCodigo: 401,
    errorMensaje: "No autorizado"
  })
}

function soloAdministrador (res) {
  return res.status(401).json({
    estado: false,
    errorCodigo: 403,
    errorMensaje: "Solo para administadores"
  })
}

function urlNoValido (res) {
  return res.status(404).json({
    estado: false,
    errorCodigo: 404,
    errorMensaje: "Url o metodo no valido"
  })
}

function urlMetodoInvalido (res) {
  return res.status(405).json({
    estado: false,
    errorCodigo: 405,
    errorMensaje: "Url invalida"
  })
}

function noJson (res) {
  res.status(406).json({
    estado: false,
    errorCodigo: 406,
    errorMensaje: "No es un json"
  })
}

function serverError (res) {
  return res.status(500).json({
    estado: false,
    errorCodigo: 500,
    errorMensaje: "Servidor error"
  })
}
function servicioNoDisponible (res) {
  res.status(503).json({
    estado: false,
    errorCodigo: 503,
    errorMensaje: "Servicio no capacitado"
  })
}

function mongoError (res, error) {
  res.status(500).json({
    estado: false,
    errorCodigo: 503,
    errorMensaje: error
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
