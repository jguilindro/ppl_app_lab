export default {
  usuario (state) {
    return state.usuario
  },
  error (state) {
    return state.error
  },
  loading (state) {
    return state.loading
  },
  lecciones (state) {
    return state.lecciones
  },
  preguntas (state) {
    return state.preguntas
  },
  leccion (state) {
    return (id) => state.lecciones.find((leccion) => {
      if (leccion._id === id) {
        leccion.fechaInicio = leccion.fechaInicio.split('T')[0]
        return leccion
      }
    })
  },
  leccionCalificar (state) {
    return state.leccionCalificar
  }
}
