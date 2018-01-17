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

const badRequest = (mensaje) => {
	const resp = { estado: false, mensaje, codigo_estado: 400 }
  return resp	
}

const okGet = (res, datos) => {
	return res.status(200).json({datos, mensaje : 'Búsqueda exitosa'})
}

const error = (res, mensaje, datos) => {
	return res.status(500).json({mensaje, datos})
}

const okCreate = (res, datos) => {
	return res.status(200).json({mensaje : 'Registro creado', datos})
}

const noEncontrado = (res) => {
	return res.status(404).json({mensaje : 'Registro no encontrado'})
}

const okDelete = (res) => {
	return res.status(200).json({mensaje : 'Registro eliminado'})
}

const serverError = (res, error) => {
	return res.status(500).json({mensaje : 'Server error', error})
}

module.exports = {
  ERROR_SERVIDOR,
  NO_AUTORIZADO,
  ok,
  badRequest,
  okGet,
  error,
  okCreate,
  okDelete,
  serverError,
  noEncontrado,
}
