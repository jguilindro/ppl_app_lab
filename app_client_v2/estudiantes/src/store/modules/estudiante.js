const EstudianteModule = {
  namespaced: true,
  state: {
    nombres: '',
    apellidos: '',
    correo: '',
    id: '',
    grupoId: '',
    paraleloId: ''
  },
  mutations: {
    SET_ESTUDIANTE (state, payload) {
      state.nombres = payload.nombres
      state.apellidos = payload.apellidos
      state.correo = payload.correo
      state.id = payload._id
    },
    SET_GRUPO (state, payload) {
      state.grupoId = payload._id
    },
    SET_PARALELO (state, payload) {
      state.paraleloId = payload._id
    }
  },
  getters: {
    nombres (state) {
      return state.nombres
    },
    correo (state) {
      return state.correo
    },
    iniciales (state) {
      return `${state.nombres.charAt(0)}${state.apellidos.charAt(0)}`
    },
    id (state) {
      return state.id
    },
    grupo (state) {
      return state.grupoId
    },
    paralelo (state) {
      return state.paraleloId
    }
  }
}

export default EstudianteModule
