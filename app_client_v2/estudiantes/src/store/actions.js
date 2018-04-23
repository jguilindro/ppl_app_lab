import Vue from 'vue'

export default {
  async usuarioDatos ({commit}) {
    commit('setError', null)
    return new Promise((resolve, reject) => {
      Vue.http.get('/api/session/usuario_conectado')
        .then((response) => {
          if (response.body.estado) {
            commit('setLecciones', response.body.datos.lecciones)
            commit('setDatosEstudiante', response.body.datos)
            commit('setLeccionRealtimeEstadoEstudiante', response.body.datos)
            return resolve()
          } else {
            commit('setError', response.body)
          }
        })
        .catch((err) => {
          commit('setError', err)
          return reject(err)
        })
    })
  },
  verificarCodigo ({commit}, codigo) {
    commit('setError', null)
    return new Promise((resolve, reject) => {
      Vue.http.get(`/api/estudiantes/tomar_leccion/${codigo}`)
        .then((response) => {
          if (response.body.estado) {
            commit('setCodigoDatos', response.body.datos)
            commit('accionesLeccion')
            resolve()
          } else {
            commit('setError', response.body)
          }
        })
        .catch((err) => {
          commit('setError', err)
          reject(err)
        })
    })
  },
  async obtenerParaleloUsuario ({commit, state, dispatch}) {
    commit('setError', null)
    await dispatch('usuarioDatos')
    Vue.http.get(`/api/paralelos/estudiante/${state.estudiante.id}`)
      .then((response) => {
        if (response.body.estado) {
          commit('setLeccionYaComenzo', response.body.datos.leccionYaComenzo)
          commit('setParaleloDandoLeccion', response.body.datos.dandoLeccion)
          commit('accionesLeccion')
        } else {
          commit('setError', response.body)
        }
      })
      .catch((err) => {
        commit('setError', err)
      })
  },
  obtenerParaleloDatos ({commit, state}) {
    commit('setError', null)
    Vue.http.get(`/api/paralelos/estudiante/${state.estudiante.id}`)
      .then((response) => {
        if (response.body.estado) {
          commit('setLeccionYaComenzo', response.body.datos.leccionYaComenzo)
          commit('setParaleloDandoLeccion', response.body.datos.dandoLeccion)
          commit('accionesLeccion')
        } else {
          commit('setError', response.body)
        }
      })
      .catch((err) => {
        commit('setError', err)
      })
  },
  malIngresado ({commit}) {
    commit('setCodigoMalIngresado', true)
  },
  async setSocket ({commit}, socket) {
    commit('setSocket', socket)
  },
  async setSocketUsuario ({dispatch, commit}, socket) {
    await dispatch('setSocket', socket)
    commit('SOCKET_USUARIO')
  },
  redirigirlo ({commit}) {
    commit('setRedirigir')
  },
  async online ({commit, dispatch}, estado) {
    commit('setOnline', estado)
  },
  leccionDatos ({commit, state}, leccionId) {
    Vue.http.get(`/api/lecciones/detalle/${leccionId}`)
      .then((response) => {
        if (response.body.estado) {
          commit('setLeccion', response.body.datos.leccion)
        } else {
          commit('setError', response.body)
        }
      })
      .catch((err) => {
        commit('setError', err)
      })
  },
  limpiarLeccion ({commit}) {
    commit('setLeccionLimpiar')
  }
}
