export default {
  setUsuario (state, payload) {
    state.usuario = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  setLecciones (state, payload) {
    state.lecciones = payload
  },
  setPreguntas (state, payload) {
    state.preguntas = payload
  },
  addLeccion (state, payload) {
    state.lecciones.push(payload)
  },
  setLeccionCalificar (state, payload) {
    state.leccionCalificar = payload
  }
}
