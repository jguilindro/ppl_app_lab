export default {
  lecciones (state) {
    return state.lecciones
  },
  nombres (state) {
    return state.estudiante.nombres
  },
  correo (state) {
    return state.estudiante['correo']
  },
  iniciales (state) {
    return `${state.estudiante['nombres'].charAt(0)}${state.estudiante['apellidos'].charAt(0)}`
  },
  yaIngresoCodigoEstudiante (state) {
    return state.leccionRealtime.yaIngresoCodigo
  },
  estadoRealtime (state) {
    return state.leccionRealtime.estado
  },
  online (state) {
    return state.online
  },
  leccion (state) {
    return state.leccion
  },
  leccionDando (state) {
    return state.leccionDando
  },
  tiempoRestante (state) {
    return state.tiempoLeccionRealtime
  },
  getSocket (state) {
    return state.io
  }
}
