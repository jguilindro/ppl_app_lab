// https://github.com/adaltas/node-http-status/blob/master/src/index.litcoffee
// 400 malRequest
// 401 noAutorizado
// 403 soloAdministrador
// 404 urlNoValido
// 406 noJson
// 500 servicioNoDisponible

const ERROR_SERVIDOR = { datos: { estado: false, datos: 'Error en el servidor' }, codigo_estado: 500 }

const NO_AUTORIZADO = { datos: { estado: false, datos: 'No autorizado' }, codigo_estado: 401 }

const ok = (datos) => {
  const resp = { estado: true, datos, codigo_estado: 200 }
  return resp
}

module.exports = {
  ERROR_SERVIDOR,
  NO_AUTORIZADO,
  ok,
}
