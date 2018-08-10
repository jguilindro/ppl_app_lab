import fetch from '@/utils/fetch'

export const ObtenerLeccionPorId = (id) => fetch(`/api/lecciones/detalle/${id}`)

export const VerificarCodigo = (codigo) => fetch(`/api/estudiantes/tomar_leccion/${codigo}`)

export const ObtenerParaleloUsuario = (estudianteId) => fetch(`/api/paralelos/estudiante/${estudianteId}`)

export const responder = (respuesta) => fetch(`/api/respuestas/`, respuesta, 'POST')

// esta usa cookies en el back, por eso no tiene parametros
export const ObtenerLeccionRealtimeDatos = () => fetch(`/api/estudiantes/leccion/datos_leccion`)

export const ObtenerDatosIniciales = (respuesta) => fetch(`/api/estudiantes/leccion/datos_leccion`)
