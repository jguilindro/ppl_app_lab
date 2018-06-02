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
  }
}
