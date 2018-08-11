const EstudianteModule = {
  namespaced: true,
  state: {
    nombres: '',
    apellidos: '',
    correo: '',
    id: ''
  },
  mutations: {
    SET_ESTUDIANTE (state, payload) {
      state.nombres = payload.nombres
      state.apellidos = payload.apellidos
      state.correo = payload.correo
      state.id = payload._id
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
    }
  }
}

export default EstudianteModule
