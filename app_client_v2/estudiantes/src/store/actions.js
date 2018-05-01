import Vue from 'vue'
import leccion from './dump/data/leccion.estimacion.json'
export default {
  async usuarioDatos ({commit}) {
    commit('setError', null)
    if (process.env.NODE_ENV === 'production') {
      return new Promise((resolve, reject) => {
        Vue.http.get('/api/estudiantes/leccion/datos_leccion')
          .then((paralelos) => {
            if (paralelos.body.estado) {
              commit('setLecciones', paralelos.body.datos.estudiante.lecciones)
              commit('setDatosEstudiante', paralelos.body.datos.estudiante)
              commit('setLeccionRealtimeEstadoEstudiante', paralelos.body.datos.estudiante)
              commit('setDatosMuchos', paralelos.body.datos)
              commit('setRealtimeLeccion', paralelos.body.datos)
              commit('SOCKET_USUARIO')
              return resolve()
            }
          }).catch((err) => {
            commit('setError', err)
            return reject(err)
          })
      })
    } else if (process.env.NODE_ENV === 'development') {
      return new Promise((resolve, reject) => {
        let paralelos = leccion
        // commit('setLecciones', paralelos.estudiante.lecciones)
        commit('setDatosEstudiante', paralelos.estudiante)
        commit('setLeccionRealtimeEstadoEstudiante', paralelos.estudiante)
        commit('setDatosMuchos', paralelos)
        commit('setRealtimeLeccion', paralelos)
        commit('SOCKET_USUARIO')
        return resolve()
      })
    }
  },
  verificarCodigo ({commit, dispatch}, codigo) {
    commit('setError', null)
    dispatch('usuarioDatos')
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
