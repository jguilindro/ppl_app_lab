import { ObtenerLeccionPorId } from '@/api'
const leccionModule = {
  namespaced: true,
  state: {
    leccion: {}
  },
  mutations: {
    SET_LECCION (state, payload) {
      state.leccion = payload.leccion
    }
  },
  actions: {
    Obtener ({commit, state}, leccionId) {
      return new Promise((resolve, reject) => {
        ObtenerLeccionPorId(leccionId).then(response => {
          commit('SET_LECCION', response)
          resolve(response.leccion)
        }).catch(error => {
          reject(error)
        })
      })
    },
    ObtenerTodas ({commit, state}, leccionId) {
    }
  },
  getters: {
    leccion (state) {
      return state.leccion
    }
  }
}

export default leccionModule
