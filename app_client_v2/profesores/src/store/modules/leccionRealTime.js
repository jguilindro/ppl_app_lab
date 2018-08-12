import Vue from 'vue'
import router from '../../router'

const state = {
  leccion: null,
  tiempo: null,
  grupos: [],
  err: null,
  estado: 'sin comenzar'
}

const getters = {
  leccion (state) {
    return state.leccion
  },
  tiempo (state) {
    return state.tiempo
  },
  grupos (state) {
    return state.grupos
  },
  estadoLeccion (state) {
    return state.estado
  }
}

const actions = {
  tomar ({ commit }, payload) {
    // Actualizo el estado de la lección a 'tomando'
    Vue.http.post(`/api/lecciones/tomar/${payload.idLeccion}`)
      .then((res) => {
        // Actualizo el estado del paralelo a dando leccion
        Vue.http.post(`/api/paralelos/${payload.idParalelo}/leccion/${payload.idLeccion}`)
          .then((res) => {
            router.push(`/leccion-panel/${payload.idLeccion}/paralelo/${payload.idParalelo}`)
          })
      }, (err) => {
        commit('setError', err)
      })
  },
  comenzar ({ commit, dispatch }, payload) {
    Vue.http.post(`/api/lecciones/comenzar_leccion/${payload.idLeccion}`)
      .then((res) => {
        Vue.http.post(`/api/paralelos/${payload.idParalelo}/leccion_ya_comenzo`)
          .then((res) => {
            dispatch('sockets/comenzarLeccion', null, { root: true })
            commit('setEstadoLeccion', 'comenzada')
          })
      })
      .catch((err) => commit('setError', err))
  },
  continuar ({ dispatch }, payload) {
    dispatch('sockets/continuarLeccion', payload, { root: true })
  },
  pausar ({ dispatch }, payload) {
    dispatch('sockets/pausarLeccion', payload, { root: true })
  },
  terminar ({ dispatch, commit }) {
    Vue.http.post('/api/lecciones/terminar_leccion')
      .then((res) => {
        dispatch('sockets/terminarLeccion', null, { root: true })
      }, (err) => {
        commit('setError', err)
      })
  }
}
const mutations = {
  setLeccion (state, payload) {
    state.leccion = payload
  },
  setError (state, payload) {
    state.err = payload
  },
  setTiempo (state, payload) {
    state.tiempo = payload
  },
  setGrupos (state, payload) {
    state.grupos = payload
    state.grupos.forEach((grupo) => {
      Vue.set(grupo, 'estudiantesConectados', [])
      grupo.estudiantes.forEach((estudiante) => {
        Vue.set(estudiante, 'conectado', false)
      })
      grupo.estudiantes.sort((a, b) => {
        return a.nombres > b.nombres
      })
    })
  },
  addEstudiante (state, payload) {
    state.grupos.forEach((grupo) => {
      grupo.estudiantes.forEach((estudiante) => {
        if (estudiante._id === payload._id) {
          const existe = grupo.estudiantesConectados.some((est) => estudiante._id === est._id)
          if (!existe) {
            grupo.estudiantesConectados.push(payload)
            estudiante.conectado = true
            return true
          }
        }
      })
    })
  },
  setEstadoLeccion (state, payload) {
    state.estado = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
