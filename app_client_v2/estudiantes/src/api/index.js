import fetch from '@/utils/fetch'

export const ObtenerLeccionPorId = (id) => fetch(`/api/lecciones/detalle/${id}`)

export const ObtenerEstadosRealtime = (estudianteId) => fetch(`/api/paralelos/estudiante/${estudianteId}`)

export const ObtenerLeccionRealtimeDatos = () => fetch(`/api/estudiantes/leccion/datos_leccion`)

export const ObtenerDatosIniciales = () => fetch(`/api/estudiantes/leccion/datos_leccion`)

export const VerificarCodigo = (codigo) => fetch(`/api/estudiantes/tomar_leccion/${codigo}`)

export const Responder = (respuesta) => fetch(`/api/respuestas/`, respuesta, 'POST')
