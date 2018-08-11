import Vue from 'vue'

// import estimacion from './dump/data/leccion.estimacion.json'
// import estimacionTexto from './dump/data/leccion.estimacion.texto.json'
// import tutorial from './dump/data/leccion.tutorial.json'
// import usuario from './dump/data/usuarioDatos.json'

export default {
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
  },
  subiendoImagen ({commit}, preguntaId) {
    commit('setSubiendoImagen', preguntaId)
  },
  terminoSubirImagen ({commit}, preguntaId) {
    commit('setTerminoSubirImagen', preguntaId)
  },
  getImagen ({commit, state}, url) {
    Vue.http.get(url)
      .then((response) => {
        console.log(response)
      })
      .catch((err) => {
        commit('setError', err)
      })
  }
}
