import Vue from 'vue'
import router from '../router'

export default {
  login ({commit, dispatch}, payload) {
    commit('setError', null)
    commit('setLoading', true)
    Vue.http.post('/api/session/login/dev', payload)
      .then((res) => {
        commit('setLoading', false)
        if (res.body.estado) {
          router.push('/')
          dispatch('obtenerUsuario')
        } else {
          commit('setError', res.body)
        }
      }, (err) => {
        commit('setLoading', false)
        commit('setError', err)
      })
  },
  obtenerUsuario ({commit}) {
    commit('setError', null)
    commit('setLoading', true)
    Vue.http.get('api/session/usuario_conectado')
      .then((res) => {
        commit('setLoading', false)
        if (res.body.estado) {
          commit('setUsuario', res.body.datos)
        } else {
          commit('setError', res.body)
          router.push('/login')
        }
      }, (err) => {
        commit('setLoading', false)
        commit('setError', {mensaje: err.body.errorMensaje, codigo: err.body.errorCodigo})
        router.push('/login')
      })
  },
  logout ({commit}) {
    commit('setError', null)
    commit('setLoading', true)
    Vue.http.get('/api/session/logout')
      .then((res) => {
        commit('setLoading', false)
        if (res.ok) {
          router.push('/login')
          commit('setUsuario', null)
        } else {}
      }, (err) => {
        commit('setLoading', false)
        commit('setError', err)
      })
  },
  getLecciones ({commit}) {
    commit('setError', null)
    commit('setLoading', true)
    Vue.http.get('/api/lecciones')
      .then((response) => {
        commit('setLoading', false)
        if (response.body.estado) {
          commit('setLecciones', response.body.datos)
        } else {
          commit('setError', response.body)
        }
      }, (err) => {
        commit('setLoading', false)
        commit('setError', err)
      })
  }
}
