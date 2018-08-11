export default {
  lecciones (state) {
    return state.lecciones
  },
  estadoRealtime (state) {
    return state.realtime.estado
  },
  io (state) {
    return state.io
  },
  estaOnline (state) {
    return state.online
  }
  // yaIngresoCodigoEstudiante (state) {
  //   return false
  //   // return state.leccionRealtime.yaIngresoCodigo
  // },
  // leccion (state) {
  //   return state.leccion
  // }
  // leccionDando (state) {
  //   return state.leccionDando
  // },
  // tiempoRestante (state) {
  //   return state.tiempoLeccionRealtime
  // },
  // getSocket (state) {
  //   return state.io
  // }
}
