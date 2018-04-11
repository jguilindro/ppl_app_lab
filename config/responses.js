const ERROR_SERVIDOR = { datos: 'Error en el servidor', codigoEstado: 500, estado: false }

const NO_AUTORIZADO = { datos:  'Usuario No autorizado', codigoEstado: 401, estado: false }

const URL_NO_VALIDO = { datos:  'Url o metodo no valido', codigoEstado: 404, estado: false }

const OK = ({ datos }) => {
  const resp = { estado: true, datos, codigoEstado: 200 }
  return resp
}

const OK_ERROR = ({ mensaje }) => {
  const resp = { estado: false, datos: mensaje, codigoEstado: 200 }
  return resp
}

module.exports = {
  OK,
  OK_ERROR,
  ERROR_SERVIDOR,
  NO_AUTORIZADO,
  URL_NO_VALIDO
}